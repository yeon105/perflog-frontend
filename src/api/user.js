import { http } from "./http";

export function fetchMyReviews(page, size) {
  return http.get("reviews/member", { params: { page, size } });
}

export function fetchMyProfile() {
  return http.get("/member");
}

export function updateMyProfile({ email, password, name }) {
  return http.put("/member", { email, password, name });
}
