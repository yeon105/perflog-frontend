import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchPerfumeDetail } from "../api/perfume";
import {
  fetchReviewSummary,
  fetchReviewsByPerfume,
  createReview,
} from "../api/review";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import "../styles/pages/_shard/common.css";
import "../styles/pages/PerfumeDetailPage.css";

export default function PerfumeDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [summary, setSummary] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(null);
  const [newContent, setNewContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const { data } = await fetchPerfumeDetail(id);
        setData(data);

        try {
          const summaryRes = await fetchReviewSummary(id);
          setSummary(summaryRes.data);
        } catch {
          setSummary({
            perfumeId: id,
            averageRating: 0,
            ratingDistribution: {},
          });
        }

        try {
          const reviewsRes = await fetchReviewsByPerfume(id);
          setReviews(reviewsRes.data);
        } catch {
          setReviews([]);
        }
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleSubmit = async () => {
    if (!newContent) return;
    setSubmitting(true);
    try {
      await createReview({
        perfumeId: id,
        rating: newRating,
        content: newContent,
      });
      toast.success("리뷰 등록 완료");
      const updatedReviews = await fetchReviewsByPerfume(id);
      const updatedSummary = await fetchReviewSummary(id);
      setReviews(updatedReviews.data);
      setSummary(updatedSummary.data);
      setNewContent("");
      setNewRating(5);
      setHoverRating(null);
      setShowInput(false);
    } catch (err) {
      if (err.response?.status === 409) {
        toast.error("이미 등록된 리뷰가 있습니다.");
      } else {
        toast.error("리뷰 등록 실패");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (count) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < count ? "star filled" : "star"}>
        ★
      </span>
    ));
  };

  const renderDistributionStars = (num) => {
    const count = summary.ratingDistribution[num] || 0;
    return (
      <div key={num} className="dist-line">
        {renderStars(num)} ({count}개)
      </div>
    );
  };

  if (loading || !data) {
    return (
      <section className="page-shell detail-shell">
        <p className="detail-loading">불러오는 중…</p>
      </section>
    );
  }

  const hasTop = Array.isArray(data.topNotes) && data.topNotes.length > 0;
  const hasMid = Array.isArray(data.middleNotes) && data.middleNotes.length > 0;
  const hasBase = Array.isArray(data.baseNotes) && data.baseNotes.length > 0;

  return (
    <section className="page-shell detail-shell">
      <div className="detail-grid">
        <div className="detail-media">
          <div className="detail-image">
            {data.imageUrl ? (
              <img src={data.imageUrl} alt={data.name} />
            ) : (
              <div className="detail-image--placeholder" />
            )}
          </div>
        </div>
        <div className="detail-info">
          <div className="detail-breadcrumb">
            {data.brand} <span className="sep">›</span>
          </div>
          <h1 className="detail-title">{data.name}</h1>
          {(hasTop || hasMid || hasBase) && (
            <ul className="detail-meta">
              {hasTop && (
                <li>
                  <span className="dt">탑 노트</span>
                  <span className="dd">{data.topNotes.join(", ")}</span>
                </li>
              )}
              {hasMid && (
                <li>
                  <span className="dt">미들 노트</span>
                  <span className="dd">{data.middleNotes.join(", ")}</span>
                </li>
              )}
              {hasBase && (
                <li>
                  <span className="dt">베이스 노트</span>
                  <span className="dd">{data.baseNotes.join(", ")}</span>
                </li>
              )}
            </ul>
          )}
          <div className="detail-tags">
            {data.launchYear && (
              <span className="chip">{data.launchYear}년</span>
            )}
            {data.season && <span className="chip">{data.season}</span>}
            {data.gender && <span className="chip">{data.gender}</span>}
            {data.longevity && (
              <span className="chip">지속력 {data.longevity}</span>
            )}
          </div>
        </div>
      </div>

      <div className="review-section">
        <h2>리뷰</h2>
        {summary && (
          <div className="rating-summary">
            <div className="average-rating">
              평균 평점: {summary.averageRating.toFixed(1)}{" "}
              <span className="avg-stars">
                {renderStars(Math.round(summary.averageRating))}
              </span>
              <span className="total-count">({reviews.length}개)</span>
            </div>
            <div className="rating-distribution">
              {[5, 4, 3, 2, 1].map(renderDistributionStars)}
            </div>
          </div>
        )}

        {user && !showInput && (
          <button
            className="review-toggle-btn"
            onClick={() => setShowInput(true)}
          >
            리뷰 작성
          </button>
        )}

        {user && showInput && (
          <div className="review-input">
            <div className="star-input">
              {Array.from({ length: 5 }).map((_, i) => {
                const filled =
                  hoverRating !== null ? i < hoverRating : i < newRating;
                return (
                  <span
                    key={i}
                    className={`star ${filled ? "filled" : ""}`}
                    onClick={() => setNewRating(i + 1)}
                    onMouseEnter={() => setHoverRating(i + 1)}
                    onMouseLeave={() => setHoverRating(null)}
                  >
                    ★
                  </span>
                );
              })}
            </div>
            <textarea
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              placeholder="리뷰를 작성해주세요"
            />
            <div className="review-input-btns">
              <button
                onClick={handleSubmit}
                disabled={submitting || !newContent}
              >
                등록
              </button>
              <button
                onClick={() => setShowInput(false)}
                className="cancel-btn"
              >
                취소
              </button>
            </div>
          </div>
        )}

        <ul className="review-list">
          {reviews.length === 0 && <li>작성된 리뷰가 없습니다.</li>}
          {reviews.map((r) => (
            <li key={r.id}>
              <div className="review-stars">{renderStars(r.rating)}</div>
              <div>{r.content}</div>
              <div className="review-date">
                {new Date(r.createdAt).toLocaleString()}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
