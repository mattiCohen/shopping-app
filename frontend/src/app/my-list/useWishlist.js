"use client";

import { useEffect, useState } from "react";
import { seedItems, newId } from "./data";

const KEY = "nadunia-wishlist-v1";

export default function useWishlist() {
  const [items, setItems] = useState([]);
  const [ready, setReady] = useState(false);

  // טעינה (כרגע מהדפדפן; בהמשך אפשר להחליף בקריאה ל-API)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      setItems(raw ? JSON.parse(raw) : seedItems());
    } catch {
      setItems(seedItems());
    }
    setReady(true);
  }, []);

  // שמירה אוטומטית
  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(items));
    } catch {}
  }, [items, ready]);

  const addItem = (name, category, qty = 1) =>
    setItems((p) => [...p, { id: newId(), name: name.trim(), category, qty, status: "todo" }]);

  const removeItem = (id) => setItems((p) => p.filter((i) => i.id !== id));

  const updateItem = (id, patch) =>
    setItems((p) => p.map((i) => (i.id === id ? { ...i, ...patch } : i)));

  const changeQty = (id, delta) =>
    setItems((p) => p.map((i) => (i.id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i)));

  const bulkUpdate = (ids, patch) => {
    const s = new Set(ids);
    setItems((p) => p.map((i) => (s.has(i.id) ? { ...i, ...patch } : i)));
  };

  const bulkRemove = (ids) => {
    const s = new Set(ids);
    setItems((p) => p.filter((i) => !s.has(i.id)));
  };

  // גרירה בלוח: העברת פריט לקטגוריה (ולמקום מסוים בתוכה)
  const moveItem = (id, category, beforeId = null) =>
    setItems((p) => {
      const item = p.find((i) => i.id === id);
      if (!item) return p;
      const rest = p.filter((i) => i.id !== id);
      const moved = { ...item, category };
      if (beforeId && beforeId !== id) {
        const idx = rest.findIndex((i) => i.id === beforeId);
        if (idx >= 0) {
          rest.splice(idx, 0, moved);
          return rest;
        }
      }
      let last = -1;
      rest.forEach((i, k) => {
        if (i.category === category) last = k;
      });
      rest.splice(last + 1, 0, moved);
      return rest;
    });

  return { items, ready, addItem, removeItem, updateItem, changeQty, bulkUpdate, bulkRemove, moveItem };
}