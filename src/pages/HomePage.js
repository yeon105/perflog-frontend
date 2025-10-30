import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchPerfumes } from "../api/perfume";
import "../styles/pages/HomePage.css";

const MAX_PAGES = 5;

export default function HomePage() {
  const [list, setList] = useState([]);
  const [meta, setMeta] = useState({
    page: 1,
    size: 10,
    totalPages: 1,
    hasPrev: false,
    hasNext: false,
  });
  const [loading, setLoading] = useState(false);

  const toCardModel = (p) => ({
    id: p.id,
    brand: p.brand,
    name: p.name,
    tags: [p.season, p.gender].filter(Boolean),
    image: p.imageUrl || null,
    rating: p.averageRating,
    reviewCount: p.reviewCount,
    liked: false,
  });

  const load = useCallback(async (page, size) => {
    setLoading(true);
    try {
      const { data } = await fetchPerfumes(page, size);
      setList(data.items.map(toCardModel));
      setMeta(data.meta);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load(1, 10);
  }, [load]);

  const toggleLike = (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    setList((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, liked: !item.liked } : item
      )
    );
  };

  const getPageList = () => {
    const total = meta.totalPages;
    const current = meta.page;
    let start = Math.max(1, current - Math.floor(MAX_PAGES / 2));
    let end = start + MAX_PAGES - 1;
    if (end > total) {
      end = total;
      start = Math.max(1, end - MAX_PAGES + 1);
    }
    const pages = [];
    for (let p = start; p <= end; p++) pages.push(p);
    return pages;
  };

  const goPage = (p) => {
    if (p < 1 || p > meta.totalPages || p === meta.page) return;
    load(p);
  };

  const goPrev = () => meta.hasPrev && goPage(meta.page - 1);
  const goNext = () => meta.hasNext && goPage(meta.page + 1);

  return (
    <section className="container home-container">
      <div className="home-header">
        <span className="home-tab active">HOME</span>
      </div>

      {loading && <p style={{ textAlign: "center" }}>불러오는 중…</p>}

      <ul className="home-grid">
        {list.map((p) => (
          <li key={p.id} className="card">
            <Link
              to={`/perfumes/${p.id}`}
              className="card-link"
              aria-label={`${p.brand} ${p.name}`}
            >
              <div className="card-thumb">
                <button
                  type="button"
                  className={`card-like-btn ${p.liked ? "on" : ""}`}
                  aria-label={p.liked ? "좋아요 취소" : "좋아요"}
                  onClick={(e) => toggleLike(e, p.id)}
                >
                  {p.liked ? "♥" : "♡"}
                </button>

                {p.image ? (
                  <img src={p.image} alt={p.name} className="card-img" />
                ) : (
                  <div className="card-img placeholder" />
                )}
              </div>

              <div className="card-body">
                <div className="card-brand">{p.brand}</div>
                <div className="card-name">{p.name}</div>

                <div className="card-tags">
                  {p.tags.map((t) => (
                    <span key={t} className="tag">
                      {t}
                    </span>
                  ))}
                </div>

                <div className="card-rating">
                  ★ {p.rating.toFixed(1)}{" "}
                  <span className="review">리뷰 {p.reviewCount}</span>
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>

      <nav className="home-pagination" aria-label="Pagination">
        <button
          type="button"
          className="page-chevron"
          onClick={goPrev}
          disabled={!meta.hasPrev}
        >
          &lt;
        </button>

        {getPageList().map((p) => (
          <button
            type="button"
            key={p}
            className={`page-number ${meta.page === p ? "active" : ""}`}
            onClick={() => goPage(p)}
            aria-current={meta.page === p ? "page" : undefined}
          >
            {p}
          </button>
        ))}

        <button
          type="button"
          className="page-chevron"
          onClick={goNext}
          disabled={!meta.hasNext}
        >
          &gt;
        </button>
      </nav>
    </section>
  );
}
