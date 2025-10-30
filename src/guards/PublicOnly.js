export default function PublicOnly({ children }) {
  // TODO: 쿠키 기반 로그인 확인 후 로그인 상태면 <Navigate to="/" replace /> 처리
  return children;
}
