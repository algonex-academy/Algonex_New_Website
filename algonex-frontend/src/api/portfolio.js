import apiClient from "./client";

export const portfolioAPI = {
  list(params = {}) {
    // Default to the max page size so catalog pages show more than the
    // first 10 items; callers can still override page/page_size via params.
    return apiClient.get("/portfolio/", { params: { page_size: 50, ...params } });
  },

  detail(slug) {
    return apiClient.get(`/portfolio/${slug}/`);
  },
};
