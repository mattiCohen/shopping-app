"use client";

import { useRef, useState } from "react";
import { Pencil, X, Check, ShoppingCart, GripVertical, Plus, Minus } from "../components/Icons";

const STATUS_LABEL = { todo: "לא נקנה", cart: "בעגלה", bought: "נקנה" };
const NEXT_STATUS = { todo: "cart", cart: "bought", bought: "todo" };

/* ---------- שם פריט עם עריכה (עיפרון או לחיצה כפולה) ---------- */
function EditableName({ item, api }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(item.name);
  const skip = useRef(false);

  const start = () => {
    skip.current = false;
    setDraft(item.name);
    setEditing(true);
  };
  const commit = () => {
    if (skip.current) return;
    const v = draft.trim();
    if (v && v !== item.name) api.updateItem(item.id, { name: v });
    setEditing(false);
  };

  if (editing) {
    return (
      <input
        className="wl-edit"
        autoFocus
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === "Enter") commit();
          if (e.key === "Escape") {
            skip.current = true;
            setEditing(false);
          }
        }}
      />
    );
  }
  return (
    <span className="wl-name">
      <span onDoubleClick={start}>{item.name}</span>
      <button type="button" className="wl-icon-sm hov" onClick={start} aria-label="עריכת שם">
        <Pencil size={16} />
      </button>
    </span>
  );
}

/* ---------- כמות ---------- */
function Stepper({ item, api }) {
  return (
    <div className="wl-stepper">
      <button type="button" onClick={() => api.changeQty(item.id, -1)} aria-label="הפחתה">
        <Minus size={16} />
      </button>
      <span>{item.qty}</span>
      <button type="button" onClick={() => api.changeQty(item.id, 1)} aria-label="הוספה">
        <Plus size={16} />
      </button>
    </div>
  );
}

/* ---------- תצוגת כרטיסים ---------- */
export function CardsView({ groups, stats, api }) {
  return (
    <>
      {groups
        .filter((g) => g.items.length > 0)
        .map(({ category, items }) => (
          <section className="wl-group" key={category}>
            <div className="wl-cat-head">
              <h3>{category}</h3>
              <span>
                {stats[category].bought} מתוך {stats[category].total} נקנו
              </span>
            </div>
            <div className="wl-cards">
              {items.map((item) => (
                <div className={`wl-card ${item.status}`} key={item.id}>
                  <div className="wl-card-top">
                    <EditableName item={item} api={api} />
                    <Stepper item={item} api={api} />
                  </div>
                  <div className="wl-card-actions">
                    {item.status === "bought" ? (
                      <button type="button" className="wl-pill-btn" onClick={() => api.setStatus(item.id, "todo")}>
                        ביטול קנייה
                      </button>
                    ) : (
                      <>
                        <button type="button" className="wl-pill-btn" onClick={() => api.setStatus(item.id, "bought")}>
                          קניתי
                        </button>
                        {item.status === "cart" ? (
                          <button type="button" className="wl-pill-btn" onClick={() => api.setStatus(item.id, "todo")}>
                            הסרה מהעגלה
                          </button>
                        ) : (
                          <button type="button" className="wl-pill-btn" onClick={() => api.setStatus(item.id, "cart")}>
                            לעגלה
                          </button>
                        )}
                      </>
                    )}
                    <a className="wl-link" href={`/products?search=${encodeURIComponent(item.name)}`}>
                      חיפוש באתר
                    </a>
                    <button type="button" className="wl-icon-sm" onClick={() => api.removeItem(item.id)} aria-label="מחיקה">
                      <X size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
    </>
  );
}

/* ---------- תצוגת טבלה ---------- */
export function TableView({ items, api, selected, setSelected }) {
  const allSelected = items.length > 0 && items.every((i) => selected.has(i.id));

  const toggle = (id) =>
    setSelected((prev) => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  const toggleAll = () => setSelected(allSelected ? new Set() : new Set(items.map((i) => i.id)));

  return (
    <div className="wl-table-wrap">
      <div className="wl-table">
        <div className="wl-tr wl-th">
          <div className="wl-tcell-first">
            <input type="checkbox" className="wl-check" checked={allSelected} onChange={toggleAll} aria-label="בחירת הכל" />
            <span>פריט</span>
          </div>
          <div>קטגוריה</div>
          <div>כמות</div>
          <div>סטטוס</div>
          <div />
        </div>

        {items.map((item) => (
          <div className={`wl-tr ${item.status}`} key={item.id}>
            <div className="wl-tcell-first">
              <input
                type="checkbox"
                className="wl-check"
                checked={selected.has(item.id)}
                onChange={() => toggle(item.id)}
                aria-label="בחירת פריט"
              />
              <EditableName item={item} api={api} />
            </div>
            <div>{item.category}</div>
            <div>
              <Stepper item={item} api={api} />
            </div>
            <div>
              <button
                type="button"
                className={`wl-status ${item.status}`}
                onClick={() => api.setStatus(item.id, NEXT_STATUS[item.status])}
                title="לחצי כדי לשנות סטטוס"
              >
                {STATUS_LABEL[item.status]}
              </button>
            </div>
            <div>
              <button type="button" className="wl-icon-sm" onClick={() => api.removeItem(item.id)} aria-label="מחיקה">
                <X size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- תצוגת לוח (עם גרירה בין קטגוריות) ---------- */
export function BoardView({ groups, stats, api, onAdd }) {
  const [dragId, setDragId] = useState(null);

  const drop = (e, category, beforeId) => {
    e.preventDefault();
    e.stopPropagation();
    if (dragId) api.moveItem(dragId, category, beforeId);
    setDragId(null);
  };

  return (
    <div className="wl-board">
      {groups.map(({ category, items }) => (
        <div
          className="wl-col"
          key={category}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => drop(e, category, null)}
        >
          <div className="wl-col-head">
            <GripVertical size={18} className="wl-grip" />
            <h3>{category}</h3>
            <span className="n">
              {stats[category].bought}/{stats[category].total}
            </span>
          </div>

          <div className="wl-col-items">
            {items.map((item) => {
              const bought = item.status === "bought";
              return (
                <div
                  className={`wl-bitem ${item.status}`}
                  key={item.id}
                  draggable
                  onDragStart={() => setDragId(item.id)}
                  onDragEnd={() => setDragId(null)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => drop(e, category, item.id)}
                >
                  <GripVertical size={18} className="wl-grip" />
                  <button
                    type="button"
                    className={`wl-circle${bought ? " on" : ""}`}
                    onClick={() => api.setStatus(item.id, bought ? "todo" : "bought")}
                    aria-label="סימון כנקנה"
                  >
                    {bought && <Check size={16} />}
                  </button>
                  <EditableName item={item} api={api} />
                  <div className="wl-bactions">
                    {!bought && (
                      <button
                        type="button"
                        className={`wl-icon-sm wl-cartbtn${item.status === "cart" ? " on" : " hov"}`}
                        onClick={() => api.setStatus(item.id, item.status === "cart" ? "todo" : "cart")}
                        aria-label="עגלה"
                      >
                        <ShoppingCart size={18} />
                      </button>
                    )}
                    <button type="button" className="wl-icon-sm hov" onClick={() => api.removeItem(item.id)} aria-label="מחיקה">
                      <X size={18} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <button type="button" className="wl-addrow" onClick={() => onAdd(category)}>
            + הוספת פריט
          </button>
        </div>
      ))}
    </div>
  );
}