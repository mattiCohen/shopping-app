import ProductTabs from "./ProductTabs";
import { getProducts } from "../lib/api";

// התאימי את הרשימה לערכים האמיתיים שרשומים אצלך בעמודת category ב-DB
const categories = [
  { label: "טקסטיל", value: "טקסטיל" },
  { label: "מכשירי חשמל", value: "מכשירי חשמל" },
  { label: "אביזרים לבית", value: "אביזרים לבית" },
  { label: "מטבח", value: "מטבח" },
];

// דוגמאות שיוצגו רק אם ה-API לא זמין (למשל בזמן פיתוח לפני שהשרת רץ),
// כדי שדף הבית לא יקרוס.
const fallbackProducts = [
  { product_id: 1, product_name: "מארז מצעים זוגי 100% כותנה", selling_price: "249", image: null },
  { product_id: 2, product_name: "מיקסר עומד 5 ליטר", selling_price: "899", image: null },
  { product_id: 3, product_name: "סט סירים 10 חלקים", selling_price: "690", image: null },
  { product_id: 4, product_name: "שואב אבק רובוטי", selling_price: "1340", image: null },
];

export const dynamic = "force-dynamic";

export default async function Home() {
  let products = [];
  try {
    products = await getProducts();
  } catch (err) {
    console.error("לא הצלחתי לטעון מוצרים מה-API, מציגה נתוני דוגמה:", err);
    products = fallbackProducts;
  }

  const cartCount = 3;

  return (
    <>
      <div className="topbar">משלוח חינם מעל 300 ₪ · החזרות עד 30 יום</div>

      <header>
        <div className="logo">נדוניה</div>
        <nav>
          <ul>
            <li><a href="#">בית</a></li>
            <li><a href="#">קטגוריות</a></li>
            <li><a href="#">אודות</a></li>
            <li><a href="#">צור קשר</a></li>
          </ul>
        </nav>
        <div className="head-icons">
          <span className="icon-btn"><span className="icon-circle"></span> פרופיל</span>
          <span className="icon-btn"><span className="icon-circle"></span> מועדפים</span>
          <span className="icon-btn">
            <span className="icon-circle"></span> סל קניות
            <span className="cart-count">{cartCount}</span>
          </span>
        </div>
      </header>

      <div className="hero">
        <div className="hero-banner">
          <div>
            <h1>
              כל מה שהבית החדש צריך,<br />
              במקום אחד
            </h1>
            <p>
              נדוניה לחתונה ומתנות אונליין — משווים מחירים ודגמים ממיטב
              החברות, ומזמינים עד הבית עם משלוח.
            </p>
            <a href="#" className="btn">מתחילים לקנות</a>
          </div>
          <div className="hero-visual">תמונת באנר ראשית</div>
        </div>
      </div>

      <section className="section">
        <div className="section-head">
          <h2 className="voice">קטגוריות</h2>
          <span className="see-all">לכל הקטגוריות ←</span>
        </div>
        <div className="cat-grid">
          {categories.map((cat) => (
            <a className="cat-card" href={`/products?category=${encodeURIComponent(cat.value)}`} key={cat.value}>
              <div className="cat-thumb">תמונת קטגוריה</div>
              <div className="name">{cat.label}</div>
            </a>
          ))}
        </div>
      </section>

      <div className="promo">
        <div className="promo-inner">
          <div>
            <h3 className="voice">רשימת נדוניה חכמה</h3>
            <p>
              בונים רשימה לפי קטגוריות, משווים מחירים בין חברות, ומשתפים עם
              המשפחה — הכל במסך אחד.
            </p>
          </div>
          <a href="#" className="btn-light">איך זה עובד</a>
        </div>
      </div>

      <section className="section">
        <ProductTabs products={products} />
      </section>

      <footer>
        <div className="foot-grid">
          <div>
            <div className="logo" style={{ marginBottom: "10px" }}>נדוניה</div>
            <p style={{ color: "var(--ink-soft)", fontSize: "14px", maxWidth: "280px" }}>
              אתר קניות לנדוניה ולמתנות חתונה — משווים, בוחרים ומזמינים עד
              הבית.
            </p>
          </div>
          <div>
            <h4>ניווט</h4>
            <ul>
              <li>בית</li>
              <li>קטגוריות</li>
              <li>אודות</li>
              <li>צור קשר</li>
            </ul>
          </div>
          <div>
            <h4>שירות לקוחות</h4>
            <ul>
              <li>משלוחים</li>
              <li>החזרות</li>
              <li>שאלות נפוצות</li>
            </ul>
          </div>
          <div>
            <h4>החשבון שלי</h4>
            <ul>
              <li>פרופיל</li>
              <li>ההזמנות שלי</li>
              <li>מועדפים</li>
            </ul>
          </div>
        </div>
        <div className="foot-bottom">נדוניה © 2026</div>
      </footer>
    </>
  );
}
