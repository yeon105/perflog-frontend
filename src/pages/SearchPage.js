import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { fetchPerfumes, searchPerfumes } from "../api/perfume";
import { fetchPreferredPerfumes } from "../api/preference";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import "../styles/pages/SearchPage.css";

const PAGE_SIZE = 8;

export default function SearchPage() {
  const [params, setParams] = useSearchParams();
  const { user } = useAuth();

  const [list, setList] = useState([]);
  const [origList, setOrigList] = useState([]);
  const [meta, setMeta] = useState({
    page: 1,
    size: PAGE_SIZE,
    totalPages: 1,
    hasPrev: false,
    hasNext: false,
  });
  const [origMeta, setOrigMeta] = useState(null);
  const [loading, setLoading] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [target, setTarget] = useState(params.get("target") || "ALL");
  const [keyword, setKeyword] = useState(params.get("keyword") || "");
  const [sort, setSort] = useState("DEFAULT");

  const toCardModel = (p) => ({
    id: p.id,
    brand: p.brand,
    name: p.name,
    tags: [p.season, p.gender].filter(Boolean),
    image: p.imageUrl || null,
    rating: p.averageRating ?? 0,
    reviewCount: p.reviewCount ?? 0,
    createdAt: p.createdAt || null,
    liked: !!p.liked,
  });

  const loadDefault = async (page, size) => {
    setLoading(true);
    try {
      const { data } = await fetchPerfumes(page, size);
      const cards = data.items.map(toCardModel);
      setList(cards);
      setOrigList(cards);
      setMeta(data.meta);
      setOrigMeta(data.meta);
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
      const cards = data.items.map(toCardModel);
      setList(cards);
      setOrigList(cards);
      setMeta(data.meta);
      setOrigMeta(data.meta);
    } finally {
      setLoading(false);
    }
  };

  const loadPreferred = async () => {
    setLoading(true);
    try {
      const { data } = await fetchPreferredPerfumes();
      const cards = data.map((p) => ({
        id: p.id,
        brand: p.brand,
        name: p.name,
        tags: [p.season, p.gender].filter(Boolean),
        image: p.imageUrl || null,
        rating: p.averageRating ?? 0,
        reviewCount: p.reviewCount ?? 0,
        createdAt: null,
        liked: true,
      }));
      setList(cards);
      setOrigList(cards);
      setMeta({
        page: 1,
        size: cards.length,
        totalPages: 1,
        hasPrev: false,
        hasNext: false,
      });
    } catch {
      toast.error("선호목록 불러오기 실패");
      setSort("DEFAULT");
      await loadDefault(1, PAGE_SIZE);
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
  }, [params, user]);

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
    if (sort === "PREFERRED") return;
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

  const handleSortChange = async (value) => {
    setSort(value);
    if (value === "PREFERRED") {
      if (!user) {
        toast.error("선호순은 로그인 후에 사용할 수 있습니다.");
        setSort("DEFAULT");
        return;
      }
      await loadPreferred();
      return;
    }
    if (value === "DEFAULT") {
      setList(origList);
      if (origMeta) setMeta(origMeta);
      return;
    }
    const arr = [...origList];
    if (value === "POPULAR") {
      arr.sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0));
    } else if (value === "RATING") {
      arr.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }
    setList(arr);
    setMeta((m) => ({ ...m, page: 1 }));
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
          value={sort}
          aria-label="정렬"
          onChange={(e) => handleSortChange(e.target.value)}
        >
          <option value="DEFAULT">최신순</option>
          <option value="POPULAR">인기순</option>
          <option value="RATING">평점순</option>
          <option value="PREFERRED">선호순</option>
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
                  />{" "}
                  전체
                </label>
                <label className={`seg ${target === "NAME" ? "on" : ""}`}>
                  <input
                    type="radio"
                    name="target"
                    value="NAME"
                    checked={target === "NAME"}
                    onChange={(e) => setTarget(e.target.value)}
                  />{" "}
                  이름
                </label>
                <label className={`seg ${target === "BRAND" ? "on" : ""}`}>
                  <input
                    type="radio"
                    name="target"
                    value="BRAND"
                    checked={target === "BRAND"}
                    onChange={(e) => setTarget(e.target.value)}
                  />{" "}
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
