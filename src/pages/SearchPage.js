import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { fetchPerfumes, searchPerfumes } from "../api/perfume";
import "../styles/pages/SearchPage.css";

const PAGE_SIZE = 8;

export default function SearchPage() {
  const [params, setParams] = useSearchParams();

  const [list, setList] = useState([]);
  const [meta, setMeta] = useState({
    page: 1,
    size: PAGE_SIZE,
    totalPages: 1,
    hasPrev: false,
    hasNext: false,
  });
  const [loading, setLoading] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [target, setTarget] = useState(params.get("target") || "ALL");
  const [keyword, setKeyword] = useState(params.get("keyword") || "");

  const toCardModel = (p) => ({
    id: p.id,
    brand: p.brand,
    name: p.name,
    tags: [p.season, p.gender].filter(Boolean),
    image: p.imageUrl || null,
    rating: p.averageRating ?? 0,
    reviewCount: p.reviewCount ?? 0,
    liked: false,
  });

  const loadDefault = async (page, size) => {
    setLoading(true);
    try {
      const { data } = await fetchPerfumes(page, size);
      setList(data.items.map(toCardModel));
      setMeta(data.meta);
    } finally {
      setLoading(false);
    }
  };

  const loadSearch = async (page, size, tgt, kw) => {
    setLoading(true);
    try {
      const { data } = await searchPerfumes({
        target: tgt,
        keyword: kw,
        page,
        size,
      });
      setList(data.items.map(toCardModel));
      setMeta(data.meta);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const kw = params.get("keyword") || "";
    const tg = params.get("target") || "ALL";
    if (kw.trim() === "") loadDefault(1, PAGE_SIZE);
    else loadSearch(1, PAGE_SIZE, tg, kw);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  const MAX_PAGES = 5;
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
    const kw = params.get("keyword") || "";
    const tg = params.get("target") || "ALL";
    if (kw.trim() === "") loadDefault(p, PAGE_SIZE);
    else loadSearch(p, PAGE_SIZE, tg, kw);
  };

  const goPrev = () => meta.hasPrev && goPage(meta.page - 1);
  const goNext = () => meta.hasNext && goPage(meta.page + 1);

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  const submitSearch = (e) => {
    e.preventDefault();
    setParams({ target, keyword }, { replace: true });
    closeModal();
  };

  return (
    <section className="container search-container">
      <div className="search-toolbar">
        <button
          type="button"
          className="search-trigger"
          onClick={openModal}
          aria-label="검색 열기"
        >
          🔍
        </button>
        <div className="tool-spacer" />
        <select
          className="sort-select"
          defaultValue="POPULAR"
          aria-label="정렬"
        >
          <option value="POPULAR">인기순</option>
        </select>
      </div>

      {loading && <p className="loading">불러오는 중…</p>}

      <ul className="home-grid">
        {list.map((m) => (
          <li key={m.id} className="card">
            <Link to={`/perfumes/${m.id}`} className="card-link">
              <div className="card-thumb">
                {m.image ? (
                  <img src={m.image} alt={m.name} className="card-img" />
                ) : (
                  <div className="card-img placeholder" />
                )}
              </div>
              <div className="card-body">
                <div className="card-brand">{m.brand}</div>
                <div className="card-name">{m.name}</div>
                <div className="card-tags">
                  {m.tags.map((t) => (
                    <span key={t} className="tag">
                      {t}
                    </span>
                  ))}
                </div>
                <div className="card-rating">
                  ★ {Number(m.rating || 0).toFixed(1)}{" "}
                  <span className="review">리뷰 {m.reviewCount || 0}</span>
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>

      <nav className="home-pagination">
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
            key={p}
            className={`page-number ${meta.page === p ? "active" : ""}`}
            onClick={() => goPage(p)}
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

      {modalOpen && (
        <>
          <div className="modal-backdrop" onClick={closeModal} />
          <div className="search-modal" role="dialog" aria-modal="true">
            <h2 className="modal-title">검색</h2>
            <form onSubmit={submitSearch} className="modal-form">
              <div className="target-segment">
                <label className={`seg ${target === "ALL" ? "on" : ""}`}>
                  <input
                    type="radio"
                    name="target"
                    value="ALL"
                    checked={target === "ALL"}
                    onChange={(e) => setTarget(e.target.value)}
                  />
                  전체
                </label>
                <label className={`seg ${target === "NAME" ? "on" : ""}`}>
                  <input
                    type="radio"
                    name="target"
                    value="NAME"
                    checked={target === "NAME"}
                    onChange={(e) => setTarget(e.target.value)}
                  />
                  이름
                </label>
                <label className={`seg ${target === "BRAND" ? "on" : ""}`}>
                  <input
                    type="radio"
                    name="target"
                    value="BRAND"
                    checked={target === "BRAND"}
                    onChange={(e) => setTarget(e.target.value)}
                  />
                  브랜드
                </label>
              </div>
              <input
                className="keyword-input"
                placeholder="브랜드 또는 상품 이름을 입력하세요"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                autoFocus
              />
              <div className="modal-actions">
                <button
                  type="button"
                  className="btn ghost"
                  onClick={closeModal}
                >
                  취소
                </button>
                <button type="submit" className="btn solid">
                  검색
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </section>
  );
}
