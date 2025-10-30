import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signupApi } from "../../api/auth";
import toast from "react-hot-toast";
import "../../styles/pages/_shard/auth.css";

export default function SignupPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "", name: "" });
  const [submitting, setSubmitting] = useState(false);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await signupApi({
        email: form.email,
        password: form.password,
        name: form.name,
      });
      toast.success("회원가입이 완료되었습니다.");
      navigate("/login", { replace: true });
    } catch (error) {
      toast.error(error.response.data.message);
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
        <input
          name="name"
          type="text"
          placeholder="이름"
          value={form.name}
          onChange={onChange}
          className="auth-input"
          required
        />

        <button type="submit" disabled={submitting} className="auth-button">
          {submitting ? "가입 중..." : "회원가입"}
        </button>
      </form>

      <div className="auth-links">
        <span>이미 계정이 있나요?</span> <Link to="/login">로그인</Link>
      </div>
    </section>
  );
}
