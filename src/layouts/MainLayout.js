import { Outlet, Link } from "react-router-dom";

export default function MainLayout() {
  return (
    <div>
      <header style={{ padding: 12, borderBottom: "1px solid #eee" }}>
        <Link to="/" style={{ fontWeight: 700, fontSize: 18 }}>
          PerfLog
        </Link>
        <nav style={{ marginLeft: 16, display: "inline-block" }}>
          <Link to="/login" style={{ marginRight: 8 }}>
            로그인
          </Link>
          <Link to="/signup">회원가입</Link>
        </nav>
      </header>
      <main style={{ padding: 16 }}>
        <Outlet />
      </main>
    </div>
  );
}
