import { User, Globe, ChevronDown, Search, ShoppingCart } from "./Icons";

const topLinks = ["אודות", "צור קשר", "תמיכה"];
const navLinks = ["מצעים", "מגבות", "כלים לשולחן", "מטבח", "מוצרי חשמל", "שעונים", "מתנות"];

export default function Header() {
  return (
    <>
      <div className="topbar">כל ההזמנה ממחסן אחד, במשלוח אחד</div>

      <div className="head-top">
        <div className="wrap">
          <ul className="top-links">
            {topLinks.map((l) => (
              <li key={l}><a href="#">{l}</a></li>
            ))}
          </ul>
          <div className="top-actions">
            <a href="#" className="pill pill-gold">הרשמה</a>
            <a href="#" className="pill pill-green"><User size={22} /> האזור האישי</a>
            <button type="button" className="lang-btn">
              <Globe size={24} /> עברית <ChevronDown size={18} />
            </button>
          </div>
        </div>
      </div>

      <header className="head-main">
        <div className="wrap">
          <a href="/" className="logo">נדונליין</a>
          <nav className="main-nav">
            {navLinks.map((l) => (
              <a key={l} href={`/products?category=${encodeURIComponent(l)}`}>{l}</a>
            ))}
          </nav>
          <div className="head-icons">
            <a href="#" className="pill pill-outline" style={{ fontSize: 22, padding: "16px 34px" }}>הרשימה שלי</a>
            <button type="button" className="circle-btn" aria-label="חיפוש"><Search size={24} /></button>
            <button type="button" className="circle-btn filled" aria-label="סל קניות"><ShoppingCart size={24} /></button>
          </div>
        </div>
      </header>
    </>
  );
}