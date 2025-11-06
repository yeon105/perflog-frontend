import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchMyProfile, updateMyProfile } from "../api/user";
import "../styles/pages/AccountEditPage.css";
import toast from "react-hot-toast";

export default function AccountEditPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    email: "",
    name: "",
    password: "",
    passwordConfirm: "",
  });

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const { data } = await fetchMyProfile();
        setForm({
          email: data.email || "",
          name: data.name || "",
          password: "",
          passwordConfirm: "",
        });
      } catch {
        toast.error("프로필 불러오기 실패");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.passwordConfirm) {
      toast.error("비밀번호 확인이 일치하지 않습니다.");
      return;
    }
    setSaving(true);
    try {
      await updateMyProfile({
        email: form.email,
        name: form.name,
        password: form.password,
      });
      toast.success("계정 정보가 수정되었습니다.");
      navigate("/my", { replace: true });
    } catch (err) {
      const msg = err?.response?.data?.message || "수정에 실패했습니다.";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="container account-edit-container">
      <h1>계정 정보 수정</h1>
      {loading && <p className="muted">불러오는 중…</p>}
      {!loading && (
        <form className="account-form" onSubmit={onSubmit}>
          <label className="field">
            <div className="label">이메일</div>
            <input name="email" value={form.email} readOnly />
          </label>

          <label className="field">
            <div className="label">이름</div>
            <input name="name" value={form.name} onChange={onChange} required />
          </label>

          <label className="field">
            <div className="label">비밀번호</div>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={onChange}
              placeholder="새 비밀번호 입력"
              required
            />
          </label>

          <label className="field">
            <div className="label">비밀번호 확인</div>
            <input
              name="passwordConfirm"
              type="password"
              value={form.passwordConfirm}
              onChange={onChange}
              placeholder="비밀번호 확인"
              required
            />
          </label>

          <div className="actions">
            <button
              type="button"
              className="btn ghost"
              onClick={() => navigate(-1)}
            >
              취소
            </button>
            <button type="submit" className="btn solid" disabled={saving}>
              {saving ? "저장 중…" : "저장"}
            </button>
          </div>
        </form>
      )}
    </section>
  );
}
