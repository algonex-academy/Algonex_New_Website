import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor — attach access token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor — auto-refresh on 401
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refresh_token");
        if (!refreshToken) {
          throw new Error("No refresh token");
        }

        const response = await axios.post(`${API_BASE_URL}/auth/token/refresh/`, {
          refresh: refreshToken,
        });

        const { access, refresh } = response.data;
        localStorage.setItem("access_token", access);
        // ROTATE_REFRESH_TOKENS is on server-side: each refresh returns a NEW
        // refresh token. Discarding it means the session hard-expires 7 days
        // after login no matter how active the user is.
        if (refresh) {
          localStorage.setItem("refresh_token", refresh);
        }

        originalRequest.headers.Authorization = `Bearer ${access}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        // Only force the login page for protected areas — public pages fire
        // authenticated requests too (stale token on refresh), and yanking a
        // visitor off the homepage to /signin is the "breaks after refresh" bug.
        const path = window.location.pathname;
        const isProtected = ["/profile", "/my-", "/dashboard", "/admin-backups"]
          .some((p) => path.startsWith(p));
        if (isProtected) {
          window.location.href = "/signin";
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
