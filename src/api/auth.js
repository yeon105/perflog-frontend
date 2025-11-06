import { http } from "./http";

export function signupApi({ email, password, name }) {
  return http.post("/member", { email, password, name });
}

export async function loginApi({ email, password }) {
  return http.post("/member/login", { email, password });
}

export function refreshToken() {
  return http.post("/member/refresh");
}

export function fetchMe() {
  return http.get("/member");
}

export function logoutApi() {
  return http.post("/member/logout");
}
