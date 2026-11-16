"use client";

import { useEffect, useState, useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ChevronDown, SlidersHorizontal, X, Plus, Heart, Image as ImageIcon } from "../components/Icons";
import { getCatalog, getImageUrl, formatPrice } from "../../lib/api";

const COLOR_HEX = {
  "שחור": "#222222", "לבן": "#ffffff", "אפור": "#b7b8b0", "בז'": "#e8dcc4", "בז": "#e8dcc4",
  "קרם": "#f3ecd8", "שמנת": "#f3ecd8", "חום": "#8a5a3c", "קאמל": "#b98a55", "זהב": "#d4af37",
  "כסף": "#c0c0c0", "אדום": "#c0392b", "בורדו": "#7b2d3a", "ורוד": "#e8b4bc", "סגול": "#b9a6d3",
  "לילך": "#c8b6de", "כחול": "#2f5d8a", "תכלת": "#b5d3e7", "טורקיז": "#86c1bf", "ירוק": "#4a7c59",
  "זית": "#7d8450", "מנטה": "#b7d3bd", "צהוב": "#e5c95b", "חרדל": "#d6b250", "כתום": "#e08a3c",
  "אבן": "#c9c3b2",
};
const colorHex = (name) => COLOR_HEX[String(name || "").trim()] || null;

const SORTS = [
  { key: "newest", label: "חדשים ראשונים" },
  { key: "price_asc", label: "מחיר: מהנמוך לגבוה" },
  { key: "price_desc", label: "מחיר: מהגבוה לנמוך" },
  { key: "name", label: "שם: א-ת" },
];

const EMPTY = { type: [], brand: [], color: [], min: "", max: "", inStock: false };
const csv = (v) => String(v || "").split(",").filter(Boolean);

export default function CatalogView({ data, filters, categoryId, pageSize }) {
  const router = useRouter();
  const pathname = usePathname();
  const [pending, startTransition] = useTransition();

  const [products, setProducts] = useState(data.products);
  const [total, setTotal] = useState(data.total);
  const [loadingMore, setLoadingMore] = useState(false);
  const [favs, setFavs] = useState(() => new Set());

  const [open, setOpen] = useState(false);
  const [focus, setFocus] = useState(null);
  const [draft, setDraft] = useState(EMPTY);
  const [draftTotal, setDraftTotal] = useState(data.total);

  const { children = [], facets = {}, breadcrumb = [], category } = data;
  const brands = facets.brands || [];
  const colors = facets.colors || [];
  const price = facets.price || { min: 0, max: 0 };

  const applied = {
    type: csv(filters.type),
    brand: csv(filters.brand),
    color: csv(filters.color),
    min: filters.min || "",
    max: filters.max || "",
    inStock: filters.inStock === "1",
    sort: filters.sort || "newest",
  };
  const hasPrice = !!(applied.min || applied.max);
  const anyApplied =
    applied.type.length || applied.brand.length || applied.color.length || hasPrice || applied.inStock;

  const title = category?.name || (filters.q ? `חיפוש: ${filters.q}` : "כל המוצרים");

  /* ---------- ניווט (הסינון נשמר ב-URL) ---------- */
  const go = (patch) => {
    const merged = { ...filters, ...patch };
    const params = new URLSearchParams();
    if (categoryId) params.set("category", categoryId);
    ["type", "brand", "color", "min", "max", "inStock", "sort", "q"].forEach((k) => {
      if (merged[k]) params.set(k, merged[k]);
    });
    const qs = params.toString();
    startTransition(() => router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false }));
  };

  const clearAll = () => go({ type: "", brand: "", color: "", min: "", max: "", inStock: "" });

  /* ---------- הצג עוד ---------- */
  const loadMore = async () => {
    setLoadingMore(true);
    try {
      const next = await getCatalog(categoryId, { ...filters, limit: pageSize, offset: products.length });
      if (next) {
        setProducts((p) => [...p, ...next.products]);
        setTotal(next.total);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingMore(false);
    }
  };

  /* ---------- מגירת סינונים ---------- */
  const openDrawer = (section) => {
    setDraft({
      type: applied.type,
      brand: applied.brand,
      color: applied.color,
      min: applied.min,
      max: applied.max,
      inStock: applied.inStock,
    });
    setDraftTotal(total);
    setFocus(section || null);
    setOpen(true);
  };

  const toggle = (key, val) =>
    setDraft((d) => ({
      ...d,
      [key]: d[key].includes(val) ? d[key].filter((x) => x !== val) : [...d[key], val],
    }));

  const apply = () => {
    setOpen(false);
    go({
      type: draft.type.join(","),
      brand: draft.brand.join(","),
      color: draft.color.join(","),
      min: draft.min,
      max: draft.max,
      inStock: draft.inStock ? "1" : "",
    });
  };

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  useEffect(() => {
    if (!open || !focus) return;
    const t = setTimeout(
      () => document.getElementById(`pc-sec-${focus}`)?.scrollIntoView({ block: "start" }),
      30
    );
    return () => clearTimeout(t);
  }, [open, focus]);

  // ספירה חיה של התוצאות בזמן בחירת סינונים במגירה
  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    const t = setTimeout(async () => {
      try {
        const r = await getCatalog(categoryId, {
          type: draft.type,
          brand: draft.brand,
          color: draft.color,
          min: draft.min,
          max: draft.max,
          inStock: draft.inStock ? "1" : "",
          q: filters.q,
          limit: 1,
          offset: 0,
        });
        if (!cancelled && r) setDraftTotal(r.total);
      } catch {}
    }, 250);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft, open]);

  const toggleFav = (id) =>
    setFavs((prev) => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });

  return (
    <div className={pending ? "pc-pending" : ""}>
      {/* פירורי לחם */}
      <nav className="pc-crumbs">
        <a href="/">בית</a>
        {breadcrumb.length === 0 ? (
          <> / <span>{title}</span></>
        ) : (
          breadcrumb.map((b, i) => (
            <span key={b.category_id}>
              {" / "}
              {i === breadcrumb.length - 1 ? (
                b.name
              ) : (
                <a href={`/products?category=${b.category_id}`}>{b.name}</a>
              )}
            </span>
          ))
        )}
      </nav>

      <div className="pc-titlerow">
        <h1>{title}</h1>
        <span className="pc-count">{total} מוצרים</span>
      </div>

      {/* שורת סינון */}
      <div className="pc-toolbar">
        <button type="button" className="pc-chip all" onClick={() => openDrawer()}>
          <SlidersHorizontal size={20} /> כל הסינונים
        </button>
        {children.length > 0 && (
          <button type="button" className={`pc-chip${applied.type.length ? " on" : ""}`} onClick={() => openDrawer("type")}>
            סוג <ChevronDown size={18} />
          </button>
        )}
        {colors.length > 0 && (
          <button type="button" className={`pc-chip${applied.color.length ? " on" : ""}`} onClick={() => openDrawer("color")}>
            צבע <ChevronDown size={18} />
          </button>
        )}
        {brands.length > 0 && (
          <button type="button" className={`pc-chip${applied.brand.length ? " on" : ""}`} onClick={() => openDrawer("brand")}>
            מותג <ChevronDown size={18} />
          </button>
        )}
        <button type="button" className={`pc-chip${hasPrice ? " on" : ""}`} onClick={() => openDrawer("price")}>
          מחיר <ChevronDown size={18} />
        </button>
        <button
          type="button"
          className={`pc-chip${applied.inStock ? " on" : ""}`}
          onClick={() => go({ inStock: applied.inStock ? "" : "1" })}
        >
          במלאי
        </button>
        {anyApplied ? (
          <button type="button" className="pc-clear" onClick={clearAll}>
            ניקוי הכל
          </button>
        ) : null}

        <label className="pc-sort">
          <select
            value={applied.sort}
            onChange={(e) => go({ sort: e.target.value === "newest" ? "" : e.target.value })}
          >
            {SORTS.map((s) => (
              <option key={s.key} value={s.key}>
                מיון: {s.label}
              </option>
            ))}
          </select>
          <ChevronDown size={18} />
        </label>
      </div>

      {/* רשת מוצרים */}
      {products.length === 0 ? (
        <div className="wl-empty">
          <p>לא נמצאו מוצרים התואמים לסינון.</p>
          {anyApplied ? (
            <button type="button" className="pc-chip" style={{ marginTop: 20 }} onClick={clearAll}>
              ניקוי סינונים
            </button>
          ) : null}
        </div>
      ) : (
        <>
          <div className="pc-grid">
            {products.map((p) => {
              const img = getImageUrl(p.image);
              const out = p.stock <= 0;
              const hex = colorHex(p.color);
              return (
                <article className="pc-card" key={p.product_id}>
                  <div className="pc-thumb">
                    {img ? <img src={img} alt={p.product_name} /> : <ImageIcon size={52} strokeWidth={1.4} />}
                    {out && <span className="pc-badge out">אזל</span>}
                    <button type="button" className="pc-add" disabled={out} aria-label="הוספה לעגלה">
                      <Plus size={26} />
                    </button>
                  </div>
                  <h3 className="pc-name">{p.product_name}</h3>
                  <div className="pc-sku">
                    {p.brand_name ? `${p.brand_name} · ` : ""}מק"ט {p.product_id}
                  </div>
                  <div className="pc-row">
                    <span className="pc-price">{formatPrice(p.selling_price)}</span>
                    <button
                      type="button"
                      className={`pc-heart${favs.has(p.product_id) ? " on" : ""}`}
                      onClick={() => toggleFav(p.product_id)}
                      aria-label="מועדפים"
                    >
                      <Heart size={24} fill={favs.has(p.product_id) ? "currentColor" : "none"} />
                    </button>
                  </div>
                  {p.color ? (
                    <div className="pc-swatches">
                      {hex ? (
                        <span className="pc-swatch" style={{ background: hex }} title={p.color} />
                      ) : (
                        <span className="pc-swatch-text">{p.color}</span>
                      )}
                    </div>
                  ) : null}
                </article>
              );
            })}
          </div>

          <div className="pc-more">
            <p>
              {products.length} מתוך {total} מוצרים
            </p>
            {products.length < total && (
              <button type="button" onClick={loadMore} disabled={loadingMore}>
                {loadingMore ? "טוען..." : "הצג עוד מוצרים"}
              </button>
            )}
          </div>
        </>
      )}

      {/* מגירת כל הסינונים */}
      {open && (
        <div className="pc-overlay" onClick={() => setOpen(false)}>
          <aside className="pc-drawer" onClick={(e) => e.stopPropagation()} role="dialog" aria-label="כל הסינונים">
            <div className="pc-drawer-head">
              <h2>כל הסינונים</h2>
              <button type="button" className="pc-x" onClick={() => setOpen(false)} aria-label="סגירה">
                <X size={30} />
              </button>
            </div>

            <div className="pc-drawer-body">
              {children.length > 0 && (
                <section className="pc-sec" id="pc-sec-type">
                  <h3>סוג</h3>
                  <div className="pc-opts">
                    {children.map((ch) => {
                      const id = String(ch.category_id);
                      return (
                        <button
                          type="button"
                          key={id}
                          className={`pc-opt${draft.type.includes(id) ? " on" : ""}`}
                          onClick={() => toggle("type", id)}
                        >
                          {ch.name} <span className="n">{ch.count}</span>
                        </button>
                      );
                    })}
                  </div>
                </section>
              )}

              {brands.length > 0 && (
                <section className="pc-sec" id="pc-sec-brand">
                  <h3>מותג</h3>
                  <div className="pc-opts">
                    {brands.map((b) => {
                      const id = String(b.id);
                      return (
                        <button
                          type="button"
                          key={id}
                          className={`pc-opt${draft.brand.includes(id) ? " on" : ""}`}
                          onClick={() => toggle("brand", id)}
                        >
                          {b.name} <span className="n">{b.count}</span>
                        </button>
                      );
                    })}
                  </div>
                </section>
              )}

              {colors.length > 0 && (
                <section className="pc-sec" id="pc-sec-color">
                  <h3>צבע</h3>
                  <div className="pc-opts">
                    {colors.map((c) => {
                      const hex = colorHex(c.value);
                      const on = draft.color.includes(c.value);
                      return hex ? (
                        <button
                          type="button"
                          key={c.value}
                          className={`pc-sw${on ? " on" : ""}`}
                          style={{ background: hex }}
                          title={`${c.value} (${c.count})`}
                          aria-label={c.value}
                          onClick={() => toggle("color", c.value)}
                        />
                      ) : (
                        <button
                          type="button"
                          key={c.value}
                          className={`pc-opt${on ? " on" : ""}`}
                          onClick={() => toggle("color", c.value)}
                        >
                          {c.value} <span className="n">{c.count}</span>
                        </button>
                      );
                    })}
                  </div>
                </section>
              )}

              <section className="pc-sec" id="pc-sec-price">
                <h3>מחיר</h3>
                <div className="pc-price-inputs">
                  <input
                    type="number"
                    inputMode="numeric"
                    min="0"
                    placeholder={`מ-${price.min}`}
                    value={draft.min}
                    onChange={(e) => setDraft((d) => ({ ...d, min: e.target.value }))}
                  />
                  <span>–</span>
                  <input
                    type="number"
                    inputMode="numeric"
                    min="0"
                    placeholder={`עד ${price.max}`}
                    value={draft.max}
                    onChange={(e) => setDraft((d) => ({ ...d, max: e.target.value }))}
                  />
                  <span>₪</span>
                </div>
              </section>

              <section className="pc-sec" id="pc-sec-stock">
                <h3>זמינות</h3>
                <div className="pc-opts">
                  <button
                    type="button"
                    className={`pc-opt${draft.inStock ? " on" : ""}`}
                    onClick={() => setDraft((d) => ({ ...d, inStock: !d.inStock }))}
                  >
                    במלאי בלבד
                  </button>
                </div>
              </section>
            </div>

            <div className="pc-drawer-foot">
              <button type="button" className="show" onClick={apply}>
                הצג {draftTotal} מוצרים
              </button>
              <button type="button" className="clear" onClick={() => setDraft(EMPTY)}>
                ניקוי
              </button>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}