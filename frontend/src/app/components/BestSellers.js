import { Image as ImageIcon } from "./Icons";
import { getImageUrl, formatPrice } from "../../lib/api";

export default function BestSellers({ products }) {
  return (
    <section className="best">
      <div className="wrap">
        <div className="sec-head">
          <h2 className="h2">הנמכרים ביותר</h2>
          <a href="/products" className="link-all">הכל ←</a>
        </div>

        {products.length === 0 ? (
          <p style={{ color: "var(--ink-soft)" }}>אין עדיין מוצרים להצגה.</p>
        ) : (
          <div className="h-scroll">
            {products.slice(0, 8).map((p) => {
              const img = getImageUrl(p.image);
              return (
                <div className="prod-card" key={p.product_id}>
                  <div className="prod-thumb">
                    {img ? <img src={img} alt={p.product_name} /> : <ImageIcon size={44} />}
                  </div>
                  {/* אין עמודת מותג ב-DB, אז מוצגת הקטגוריה (או מק"ט) */}
                  <div className="prod-brand">{p.category || `מק"ט ${p.product_id}`}</div>
                  <div className="prod-name">{p.product_name}</div>
                  <div className="prod-price">{formatPrice(p.selling_price)}</div>
                  <button type="button" className="pill pill-outline">+ הוספה לסל</button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}