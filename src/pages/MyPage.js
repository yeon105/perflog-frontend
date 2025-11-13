import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { fetchMyReviews } from "../api/user";
import { deleteReview } from "../api/review";
import toast from "react-hot-toast";
import "../styles/pages/MyPage.css";

export default function MyPage() {
  const navigate = useNavigate();
  const [list, setList] = useState([]);
  const [meta, setMeta] = useState({
    page: 1,
    size: 10,
    totalPages: 1,
    hasPrev: false,
    hasNext: false,
  });
  const [loading, setLoading] = useState(false);

  const truncateContent = (content, length = 15) => {
    if (!content) return "-";
    return content.length > length ? content.slice(0, length) + "..." : content;
  };

  const load = async (page = 1) => {
    setLoading(true);
    try {
      const res = await fetchMyReviews(page, meta.size);
      const data = res.data;
      setList(data.items || []);
      setMeta({
        page: data.meta?.page || 1,
        size: data.meta?.size || meta.size,
        totalPages: data.meta?.totalPages || 1,
        hasPrev: data.meta?.hasPrev || false,
        hasNext: data.meta?.hasNext || false,
      });
    } catch (e) {
      toast.error("내 리뷰 불러오기 실패");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(1);
  }, []);

  const goPage = (p) => {
    if (p < 1 || p > meta.totalPages || p === meta.page) return;
    load(p);
  };

  const handleDelete = async (reviewId) => {
    try {
      await deleteReview(reviewId);
      toast.success("리뷰가 삭제되었습니다.");
      load(meta.page);
    } catch (e) {
      toast.error("리뷰 삭제 실패");
    }
  };

  return (
    <section className="container mypage-container">
      <div className="mypage-header">
        <h1>내 정보</h1>
      </div>

      <div className="mypage-body">
        <aside className="mypage-nav">
          <nav>
            <ul>
              <li className="active">내 리뷰</li>
              <li>
                <Link to="/my/account">계정 정보 수정</Link>
              </li>
            </ul>
          </nav>
        </aside>

        <main className="mypage-main">
          <h2>내 리뷰</h2>
          {loading && <p className="muted">불러오는 중…</p>}
          {!loading && list.length === 0 && (
            <p className="muted">등록된 리뷰가 없습니다.</p>
          )}

          {!loading && list.length > 0 && (
            <table className="reviews-table">
              <thead>
                <tr>
                  <th>내용</th>
                  <th>날짜</th>
                  <th>별점</th>
                  <th>액션</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {list.map((r) => (
                  <tr key={r.id}>
                    <td className="review-content">
                      {truncateContent(r.content)}
                    </td>
                    <td>
                      {r.createdAt
                        ? new Date(r.createdAt).toLocaleDateString()
                        : "-"}
                    </td>
                    <td>{r.rating ?? "-"}</td>
                    <td>
                      <button
                        className="btn ghost small"
                        onClick={() => navigate(`/perfumes/${r.perfumeId}`)}
                      >
                        상품으로
                      </button>
                    </td>
                    <td className="review-actions">
                      <button
                        className="btn ghost small"
                        onClick={() =>
                          navigate(
                            `/perfumes/${r.perfumeId}?editReviewId=${r.id}`
                          )
                        }
                      >
                        수정
                      </button>{" "}
                      <button
                        className="btn ghost small danger"
                        onClick={() => handleDelete(r.id)}
                      >
                        삭제
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          <div className="mypage-pagination">
            <button
              onClick={() => goPage(meta.page - 1)}
              disabled={!meta.hasPrev}
              className="page-btn"
            >
              &lt;
            </button>
            <span className="page-current">
              {meta.page} / {meta.totalPages}
            </span>
            <button
              onClick={() => goPage(meta.page + 1)}
              disabled={!meta.hasNext}
              className="page-btn"
            >
              &gt;
            </button>
          </div>
        </main>
      </div>
    </section>
  );
}
