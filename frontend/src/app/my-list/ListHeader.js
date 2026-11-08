import { User, ListChecks, Globe, ShoppingCart } from "lucide-react";
import { CATEGORIES } from "./data";

export default function ListHeader({ cartCount = 0 }) {
  return (
    <>
      <div className="wl-topbar">כל ההזמנה ממחסן אחד, במשלוח אחד</div>

      <header className="wl-head">
        <div className="wl-wrap wl-head-row">
          <a href="/" className="wl-logo">
            נדונליין
          </a>
          <div className="wl-head-icons">
            <a href="#" className="wl-circle-btn" aria-label="האזור האישי">
              <User size={26} />
            </a>
            <a href="/my-list" className="wl-circle-btn active" aria-label="הרשימה שלי">
              <ListChecks size={26} />
            </a>
            <button type="button" className="wl-circle-btn" aria-label="שפה">
              <Globe size={26} />
            </button>
            <a href="#" className="wl-circle-btn" aria-label="עגלה">
              <ShoppingCart size={26} />
              {cartCount > 0 && <span className="wl-badge">{cartCount}</span>}
            </a>
          </div>
        </div>

        <nav className="wl-nav">
          <div className="wl-wrap wl-nav-row">
            {CATEGORIES.map((c) => (
              <a key={c} href={`/products?category=${encodeURIComponent(c)}`}>
                {c}
              </a>
            ))}
          </div>
        </nav>
      </header>
    </>
  );
}