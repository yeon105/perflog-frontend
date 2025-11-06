import { http } from "./http";

export function fetchReviewsByPerfume(perfumeId) {
  return http.get(`/reviews/perfume/${perfumeId}`);
}

export function fetchReviewSummary(perfumeId) {
  return http.get(`/reviews/perfume/${perfumeId}/summary`);
}

export function createReview({ perfumeId, rating, content }) {
  return http.post("/reviews", { perfumeId, rating, content });
}
