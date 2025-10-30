import "./App.css";
import { Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import AuthLayout from "./layouts/AuthLayout";
import PublicOnly from "./guards/PublicOnly";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/auth/LoginPage";
import SignupPage from "./pages/auth/SignupPage";
import NotFound from "./pages/_shared/NotFound";

import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
      <Routes>
        {/* Auth 전용 */}
        <Route element={<AuthLayout />}>
          <Route
            path="/login"
            element={
              <PublicOnly>
                <LoginPage />
              </PublicOnly>
            }
          />
          <Route
            path="/signup"
            element={
              <PublicOnly>
                <SignupPage />
              </PublicOnly>
            }
          />
        </Route>

        {/* 메인 */}
        <Route element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>

      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            border: "2px solid #222",
            borderRadius: "14px",
            fontWeight: 600,
          },
          success: {
            iconTheme: { primary: "#16a34a", secondary: "white" },
          },
          error: {
            iconTheme: { primary: "#dc2626", secondary: "white" },
          },
        }}
      />
    </>
  );
}

export default App;
