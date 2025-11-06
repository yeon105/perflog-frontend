import { createContext, useContext, useEffect, useState } from "react";
import { refreshToken, fetchMe, logoutApi } from "../api/auth";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        await refreshToken();
        const { data } = await fetchMe();
        if (mounted) setUser(data);
      } catch {
        if (mounted) setUser(null);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => (mounted = false);
  }, []);

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === "auth:changed") {
        (async () => {
          try {
            await refreshToken();
            const { data } = await fetchMe();
            setUser(data);
          } catch {
            setUser(null);
          }
        })();
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const setAuthUser = (u) => setUser(u);

  const logout = async () => {
    try {
      await logoutApi();
    } finally {
      setUser(null);
      localStorage.setItem("auth:changed", Date.now().toString());
      toast.success("로그아웃되었습니다.");
      navigate("/", { replace: true });
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, setAuthUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
