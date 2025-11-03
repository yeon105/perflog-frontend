import { http } from "./http";

// 향수 목록 조회
export function fetchPerfumes(page, size) {
  return http.get("/perfumes", {
    params: { page, size },
  });
}

// 향수 상세정보 조회
export function fetchPerfumeDetail(perfumeId) {
  return http.get(`/perfumes/${perfumeId}`);
}

// 향수 검색
export function searchPerfumes({ target, keyword, page, size }) {
  return http.get("/perfumes/search", {
    params: { target, keyword, page, size },
  });
}
