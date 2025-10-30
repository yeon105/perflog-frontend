import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginApi } from "../../api/auth";
import "../../styles/pages/_shard/auth.css";
import toast from "react-hot-toast";

export default function LoginPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const response = await loginApi({
        email: form.email,
        password: form.password,
      });
      toast.success(response.data.message);
      navigate("/", { replace: true });
    } catch (error) {
      toast.error(error.response.data.error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="auth-container">
      <Link to="/" className="auth-title-link">
        <h1 className="auth-title">PerfLog</h1>
      </Link>

      <form onSubmit={onSubmit} className="auth-form">
        <input
          name="email"
          type="email"
          placeholder="아이디 (이메일)"
          value={form.email}
          onChange={onChange}
          className="auth-input"
          required
        />
        <input
          name="password"
          type="password"
          placeholder="비밀번호"
          value={form.password}
          onChange={onChange}
          className="auth-input"
          required
        />

        <button type="submit" disabled={submitting} className="auth-button">
          {submitting ? "로그인 중..." : "로그인"}
        </button>
      </form>

      <div className="auth-links">
        <span>아이디 찾기</span> | <span>비밀번호 찾기</span> |{" "}
        <Link to="/signup">회원가입</Link>
      </div>
    </section>
  );
}
