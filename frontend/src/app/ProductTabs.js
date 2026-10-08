"use client";

import { useState } from "react";
import { getImageUrl, formatPrice } from "../lib/api";

const tabs = ["מומלצים", "חדשים", "פופולאריים", "מבצעים"];

// כרגע אין ב-DB עמודות is_featured / is_new / is_popular / discount_price,
// אז כל הטאבים מציגים את אותה רשימת מוצרים. ברגע שיתווספו עמודות כאלה,
// אפשר להעביר לכאן query שונה לכל טאב (למשל getProducts({ is_new: true })).
export default function ProductTabs({ products }) {
  const [activeTab, setActiveTab] = useState(tabs[0]);

  return (
    <>
      <div className="prod-tabs">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`tab${tab === activeTab ? " active" : ""}`}
            onClick={() => setActiveTab(tab)}
            type="button"
          >
            {tab}
          </button>
        ))}
      </div>

      {products.length === 0 ? (
        <p style={{ color: "var(--ink-soft)" }}>אין עדיין מוצרים להצגה.</p>
      ) : (
        <div className="prod-grid">
          {products.slice(0, 4).map((product) => {
            const imageUrl = getImageUrl(product.image);
            return (
              <div className="prod-card" key={product.product_id}>
                <div className="prod-thumb">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={product.product_name}
                      style={{
                        position: "absolute",
                        inset: 0,
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    "תמונת מוצר"
                  )}
                </div>
                <div className="prod-info">
                  <div className="brand">מק"ט {product.product_id}</div>
                  <div className="name">{product.product_name}</div>
                  <div className="prices">
                    <span className="price-now">{formatPrice(product.selling_price)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
