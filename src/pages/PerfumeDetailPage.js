import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchPerfumeDetail } from "../api/perfume";
import "../styles/pages/_shard/common.css";
import "../styles/pages/PerfumeDetailPage.css";

export default function PerfumeDetailPage() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const { data } = await fetchPerfumeDetail(id);
        setData(data);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

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
  const reviewCount = 20;

  return (
    <section className="page-shell detail-shell">
      <div className="tabs-row">
        <Link to="/" className="tab active">
          HOME
        </Link>
        <Link to="/search" className="tab">
          검색
        </Link>
      </div>

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

          <div className="detail-actions">
            <button
              type="button"
              className={`pill-btn ${liked ? "on" : ""}`}
              onClick={() => setLiked((v) => !v)}
            >
              {liked ? "❤" : "♡"}(5)
            </button>
            <Link to={`/reviews/${data.id}`} className="pill-btn ghost">
              리뷰({reviewCount})
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
