import { User, ListChecks, Globe, Heart, ShoppingCart, Search } from "../components/Icons";

export default function ShopHeader({ categories = [], activeId = null, q = "" }) {
  return (
    <>
      <div className="wl-topbar">כל ההזמנה ממחסן אחד, במשלוח אחד</div>

      <header className="wl-head">
        <div className="wl-wrap wl-head-row">
          <a href="/" className="wl-logo">נדונליין</a>

          <form className="pc-search" action="/products" method="get" role="search">
            <button type="submit" aria-label="חיפוש"><Search size={22} /></button>
            <input name="q" defaultValue={q} placeholder="חיפוש בכל האתר" />
          </form>

          <div className="wl-head-icons">
            <a href="#" className="wl-circle-btn" aria-label="האזור האישי"><User size={26} /></a>
            <a href="/my-list" className="wl-circle-btn" aria-label="הרשימה שלי"><ListChecks size={26} /></a>
            <button type="button" className="wl-circle-btn" aria-label="שפה"><Globe size={26} /></button>
            <button type="button" className="wl-circle-btn" aria-label="מועדפים"><Heart size={26} /></button>
            <a href="#" className="wl-circle-btn" aria-label="עגלה"><ShoppingCart size={26} /></a>
          </div>
        </div>

        <nav className="wl-nav">
          <div className="wl-wrap wl-nav-row">
            {categories.map((c) => (
              <a
                key={c.category_id}
                href={`/products?category=${c.category_id}`}
                className={c.category_id === activeId ? "pc-active" : ""}
              >
                {c.name}
              </a>
            ))}
          </div>
        </nav>
      </header>
    </>
  );
}