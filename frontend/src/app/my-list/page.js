"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, Download, Share2, Search, ChevronDown, Image as ImageIcon } from "../components/Icons";
import "./list.css";
import ListHeader from "./ListHeader";
import ListFooter from "./ListFooter";
import AddItemModal from "./AddItemModal";
import { CardsView, TableView, BoardView } from "./Views";
import useWishlist from "./useWishlist";
import { CATEGORIES, SUGGESTIONS } from "./data";
import { getCategories } from "../../lib/api";

const FILTERS = [
  { key: "all", label: "הכל" },
  { key: "remaining", label: "נשאר לקנות" },
  { key: "cart", label: "בעגלה" },
  { key: "bought", label: "נקנו" },
];
const VIEWS = [
  { key: "board", label: "לוח" },
  { key: "table", label: "טבלה" },
  { key: "cards", label: "כרטיסים" },
];
const STATUS_LABEL = { todo: "לא נקנה", cart: "בעגלה", bought: "נקנה" };

function downloadCsv(items) {
  const rows = [
    ["פריט", "קטגוריה", "כמות", "סטטוס"],
    ...items.map((i) => [i.name, i.category, i.qty, STATUS_LABEL[i.status]]),
  ];
  const csv =
    "\uFEFF" +
    rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = "הרשימה-שלי.csv";
  a.click();
  URL.revokeObjectURL(url);
}

async function shareList(items) {
  const lines = CATEGORIES.flatMap((c) => {
    const list = items.filter((i) => i.category === c && i.status !== "bought");
    return list.length ? [`${c}:`, ...list.map((i) => `• ${i.name}${i.qty > 1 ? ` (${i.qty})` : ""}`), ""] : [];
  });
  const text = `הרשימה שלי בנדונליין\n\n${lines.join("\n")}`;
  if (navigator.share) {
    try {
      await navigator.share({ title: "הרשימה שלי – נדונליין", text });
      return;
    } catch {}
  }
  try {
    await navigator.clipboard.writeText(text);
    alert("הרשימה הועתקה ללוח");
  } catch {
    alert("לא הצלחתי להעתיק את הרשימה");
  }
}

export default function MyListPage() {
  const { items, ready, addItem, removeItem, updateItem, changeQty, bulkUpdate, bulkRemove, moveItem } =
    useWishlist();

  const [view, setView] = useState("cards");
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [catFilter, setCatFilter] = useState("all");
  const [selected, setSelected] = useState(new Set());
  const [modal, setModal] = useState({ open: false, category: null });
const [categories, setCategories] = useState([]);

useEffect(() => {
  getCategories()
    .then(setCategories)
    .catch((err) => console.error("לא הצלחתי לטעון קטגוריות:", err));
}, []);

  const total = items.length;
  const bought = items.filter((i) => i.status === "bought").length;
  const inCart = items.filter((i) => i.status === "cart").length;

  const stats = useMemo(() => {
    const s = {};
    CATEGORIES.forEach((c) => (s[c] = { total: 0, bought: 0 }));
    items.forEach((i) => {
      if (!s[i.category]) s[i.category] = { total: 0, bought: 0 };
      s[i.category].total++;
      if (i.status === "bought") s[i.category].bought++;
    });
    return s;
  }, [items]);

  const visible = useMemo(() => {
    const q = query.trim();
    return items.filter((i) => {
      if (filter === "remaining" && i.status === "bought") return false;
      if (filter === "cart" && i.status !== "cart") return false;
      if (filter === "bought" && i.status !== "bought") return false;
      if (q && !i.name.includes(q)) return false;
      if (view === "table" && catFilter !== "all" && i.category !== catFilter) return false;
      return true;
    });
  }, [items, filter, query, view, catFilter]);

  const groups = useMemo(
    () => CATEGORIES.map((c) => ({ category: c, items: visible.filter((i) => i.category === c) })),
    [visible]
  );
  const tableItems = useMemo(() => groups.flatMap((g) => g.items), [groups]);
  const selectedIds = tableItems.filter((i) => selected.has(i.id)).map((i) => i.id);

  const api = {
    setStatus: (id, status) => updateItem(id, { status }),
    updateItem,
    changeQty,
    removeItem,
    moveItem,
  };

  const names = new Set(items.map((i) => i.name));
  const suggestions = SUGGESTIONS.filter((s) => !names.has(s.name));

  const bulk = (patch) => {
    bulkUpdate(selectedIds, patch);
    setSelected(new Set());
  };

  return (
    <div className="wl-page">
<ListHeader cartCount={inCart} categories={categories} />
      <main className="wl-wrap">
        <h1 className="wl-title">הרשימה שלי</h1>
        <p className="wl-sub">
          עוברים על הרשימה לפי קטגוריה: מסמנים מה כבר נקנה, מוסיפים לעגלה, ומחפשים באתר.
        </p>

        <div className="wl-toprow">
          <div className="wl-progress">
            <div className="wl-progress-head">
              <span className="t">
                נקנו {bought} מתוך {total}
              </span>
              <span className="c">{inCart} בעגלה</span>
            </div>
            <div className="wl-bar">
              <div className="b" style={{ width: total ? `${(bought / total) * 100}%` : 0 }} />
              <div className="cart-seg" style={{ width: total ? `${(inCart / total) * 100}%` : 0 }} />
            </div>
          </div>

          <div className="wl-actions">
            <button type="button" className="wl-btn-green" onClick={() => setModal({ open: true, category: null })}>
              <Plus size={22} /> הוספת פריט
            </button>
            <button type="button" className="wl-circle-btn" onClick={() => shareList(items)} aria-label="שיתוף">
              <Share2 size={24} />
            </button>
            <button type="button" className="wl-circle-btn" onClick={() => downloadCsv(items)} aria-label="הורדה">
              <Download size={24} />
            </button>
          </div>
        </div>

        <div className="wl-controls">
          <div className="wl-seg view">
            {VIEWS.map((v) => (
              <button key={v.key} type="button" className={view === v.key ? "on" : ""} onClick={() => setView(v.key)}>
                {v.label}
              </button>
            ))}
          </div>

          <div className="wl-seg filter">
            {FILTERS.map((f) => (
              <button key={f.key} type="button" className={filter === f.key ? "on" : ""} onClick={() => setFilter(f.key)}>
                {f.label}
              </button>
            ))}
          </div>

          <div className="wl-tools">
            {view === "table" && (
              <label className="wl-select">
                <select value={catFilter} onChange={(e) => setCatFilter(e.target.value)}>
                  <option value="all">כל הקטגוריות</option>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <ChevronDown size={20} />
              </label>
            )}
            <label className="wl-search">
              <Search size={22} />
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="חיפוש בתוך הרשימה" />
            </label>
          </div>
        </div>

        {view === "table" && selectedIds.length > 0 && (
          <div className="wl-bulk">
            <b>{selectedIds.length} נבחרו</b>
            <button type="button" className="wl-chip-btn" onClick={() => bulk({ status: "cart" })}>
              לעגלה
            </button>
            <button type="button" className="wl-chip-btn" onClick={() => bulk({ status: "bought" })}>
              קניתי
            </button>
            <button type="button" className="wl-chip-btn" onClick={() => bulk({ status: "todo" })}>
              לא נקנה
            </button>
            <button
              type="button"
              className="wl-chip-btn"
              onClick={() => {
                if (window.confirm(`למחוק ${selectedIds.length} פריטים?`)) {
                  bulkRemove(selectedIds);
                  setSelected(new Set());
                }
              }}
            >
              מחיקה
            </button>
          </div>
        )}

        {!ready ? null : view !== "board" && visible.length === 0 ? (
          <p className="wl-empty">אין פריטים להצגה.</p>
        ) : view === "cards" ? (
          <CardsView groups={groups} stats={stats} api={api} />
        ) : view === "table" ? (
          <TableView items={tableItems} api={api} selected={selected} setSelected={setSelected} />
        ) : (
          <BoardView groups={groups} stats={stats} api={api} onAdd={(c) => setModal({ open: true, category: c })} />
        )}

        {suggestions.length > 0 && (
          <section className="wl-sugg">
            <h2>אולי תרצו גם</h2>
            <p>רעיונות לפי מה שבחרתם</p>
            <div className="wl-sugg-row">
              {suggestions.map((s) => (
                <div className="wl-sugg-card" key={s.name}>
                  <div className="wl-sugg-img">
                    <ImageIcon size={40} strokeWidth={1.6} />
                  </div>
                  <b>{s.name}</b>
                  <button type="button" className="wl-pill-btn" onClick={() => addItem(s.name, s.category)}>
                    + הוסיפו
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

<ListFooter categories={categories} />

      <AddItemModal
        open={modal.open}
        defaultCategory={modal.category}
        onClose={() => setModal({ open: false, category: null })}
        onAdd={addItem}
      />
    </div>
  );
}