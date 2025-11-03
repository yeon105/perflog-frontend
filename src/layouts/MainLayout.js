import { Link, Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    <div>
      <header style={{ borderBottom: "1px solid #eee" }}>
        <div
          className="container"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: 12,
          }}
        >
          <Link to="/" style={{ fontWeight: 700, fontSize: 18 }}>
            PerfLog
          </Link>
          <nav style={{ display: "flex", gap: 12 }}>
            <Link to="/login">로그인</Link>
            <Link to="/signup">회원가입</Link>
          </nav>
        </div>
      </header>

      <main className="container" style={{ padding: 16 }}>
        <Outlet />
      </main>
    </div>
  );
}
