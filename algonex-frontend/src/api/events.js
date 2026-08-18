import apiClient from "./client";

export const eventsAPI = {
  list(params = {}) {
    // Default to the max page size so catalog pages show more than the
    // first 10 items; callers can still override page/page_size via params.
    return apiClient.get("/events/", { params: { page_size: 50, ...params } });
  },

  detail(slug) {
    return apiClient.get(`/events/${slug}/`);
  },

  register(slug) {
    return apiClient.post(`/events/${slug}/register/`);
  },

  cancel(slug) {
    return apiClient.post(`/events/${slug}/cancel/`);
  },

  myRegistrations(params = {}) {
    return apiClient.get("/event-registrations/", { params });
  },
};
