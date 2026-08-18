import apiClient from "./client";

export const coursesAPI = {
  list(params = {}) {
    // Default to the max page size so catalog pages show more than the
    // first 10 items; callers can still override page/page_size via params.
    return apiClient.get("/courses/", { params: { page_size: 50, ...params } });
  },

  detail(slug) {
    return apiClient.get(`/courses/${slug}/`);
  },

  enroll(slug) {
    return apiClient.post(`/courses/${slug}/enroll/`);
  },

  myEnrollments(params = {}) {
    return apiClient.get("/enrollments/", { params });
  },

  dropEnrollment(id) {
    return apiClient.post(`/enrollments/${id}/drop/`);
  },
};
