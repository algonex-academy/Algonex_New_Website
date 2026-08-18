import apiClient from "./client";

export const careersAPI = {
  list(params = {}) {
    // Default to the max page size so catalog pages show more than the
    // first 10 items; callers can still override page/page_size via params.
    return apiClient.get("/careers/", { params: { page_size: 50, ...params } });
  },

  detail(slug) {
    return apiClient.get(`/careers/${slug}/`);
  },

  apply(slug, formData) {
    return apiClient.post(`/careers/${slug}/apply/`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  myApplications(params = {}) {
    return apiClient.get("/applications/", { params });
  },
};
