import { http } from "./http";

// 향수 목록 조회
export function fetchPerfumes(page, size) {
  return http.get("/perfumes", {
    params: { page, size },
  });
}
