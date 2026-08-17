import apiClient from "./client";

export const programsAPI = {
  list(params = {}) {
    return apiClient.get("/programs/", { params });
  },

  detail(slug) {
    return apiClient.get(`/programs/${slug}/`);
  },

  // Program interest leads (fellowship/internship applications, training
  // callbacks) are stored via the contact endpoint with form_type "lead".
  submitLead(payload) {
    return apiClient.post("/contact/submit-form/", { form_type: "lead", ...payload });
  },

  // Campus Crew registrations (student/college) — dedicated backend endpoint.
  registerCampusCrew(payload) {
    return apiClient.post("/programs/campus-crew/register/", payload);
  },
};

// Extracts a human-readable message from the backend's
// { status: "error", error: { message, details } } envelope.
export function getApiErrorMessage(err, fallback) {
  const apiError = err?.response?.data?.error;
  if (apiError?.details && typeof apiError.details === "object") {
    const detail = Object.values(apiError.details).flat().join(" ");
    if (detail) return detail;
  }
  return apiError?.message || fallback;
}
