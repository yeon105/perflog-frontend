import { Link, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function MainLayout() {
  const { user, logout } = useAuth();

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

          <nav style={{ display: "flex", gap: 12, alignItems: "center" }}>
            {!user && (
              <>
                <Link to="/search">검색</Link>
                <Link to="/login">로그인</Link>
                <Link to="/signup">회원가입</Link>
              </>
            )}

            {user && (
              <>
                <Link to="/search">검색</Link>
                <Link to="/my">MY</Link>
                <button
                  onClick={logout}
                  style={{
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    fontSize: 14,
                    textDecoration: "underline",
                  }}
                >
                  로그아웃
                </button>
              </>
            )}
          </nav>
        </div>
      </header>

      <main className="container" style={{ padding: 16 }}>
        <Outlet />
      </main>
    </div>
  );
}
