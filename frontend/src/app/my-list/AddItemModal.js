"use client";

import { useEffect, useState } from "react";
import { CATEGORIES } from "./data";

export default function AddItemModal({ open, defaultCategory, onClose, onAdd }) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    if (open) {
      setName("");
      setCategory(defaultCategory || CATEGORIES[0]);
      setQty(1);
    }
  }, [open, defaultCategory]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const submit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onAdd(name, category, Number(qty) || 1);
    onClose();
  };

  return (
    <div className="wl-overlay" onClick={onClose}>
      <form className="wl-modal" onClick={(e) => e.stopPropagation()} onSubmit={submit}>
        <h3>הוספת פריט</h3>
        <label className="wl-field">
          שם הפריט
          <input autoFocus value={name} onChange={(e) => setName(e.target.value)} placeholder="למשל: סט סירים" />
        </label>
        <label className="wl-field">
          קטגוריה
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
        <label className="wl-field">
          כמות
          <input type="number" min="1" value={qty} onChange={(e) => setQty(e.target.value)} />
        </label>
        <div className="wl-modal-actions">
          <button type="submit" className="wl-btn-green">
            הוספה
          </button>
          <button type="button" className="wl-pill-btn" onClick={onClose}>
            ביטול
          </button>
        </div>
      </form>
    </div>
  );
}