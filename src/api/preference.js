import { http } from "./http";

export function recordPreference(perfumeId, payload) {
  return http.post(`/preferences/${perfumeId}`, payload);
}

export function checkLiked(perfumeId) {
  return http.get(`/preferences/${perfumeId}/liked`);
}

export function fetchPreferredPerfumes() {
  return http.get("/preferences");
}
