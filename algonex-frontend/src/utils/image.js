export const getImageUrl = (url, fallback = 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop') => {
  if (!url) return fallback;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  
  // Extract base URL of backend from VITE_API_URL environment variable
  const apiBase = import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";
  try {
    // apiBase is RELATIVE in production builds ("/api/v1") — a bare new URL()
    // throws on it and everything fell back to localhost:8000. Resolving
    // against the current origin handles both absolute and relative bases.
    const parsed = new URL(apiBase, window.location.origin);
    const baseUrl = `${parsed.protocol}//${parsed.host}`;
    // Ensure url has leading slash
    const formattedUrl = url.startsWith('/') ? url : `/${url}`;
    return `${baseUrl}${formattedUrl}`;
  } catch (_e) {
    const baseUrl = "http://localhost:8000";
    const formattedUrl = url.startsWith('/') ? url : `/${url}`;
    return `${baseUrl}${formattedUrl}`;
  }
};
