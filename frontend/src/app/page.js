import {
  Image as ImageIcon, BedDouble, Layers, CircleDot, ShoppingBasket,
  Plug, Clock, Gift, ArrowLeft, CircleHelp, Lightbulb,
} from "./components/Icons";
import Header from "./components/Header";
import Footer from "./components/Footer";
import BestSellers from "./components/BestSellers";
import { getProducts } from "../lib/api";

export const dynamic = "force-dynamic";

const brands = ["Philips", "Bosch", "13 Avenue", "Food Appeal", "JBL", "Tefal"];

const steps = [
  { n: 1, title: "מקבלים רשימה מלאה", text: "כל מה שהבית צריך, כבר כתוב ומוכן." },
  { n: 2, title: "מתאימים אישית", text: "מוסיפים, מסירים ומסמנים מה כבר נקנה. אפשר לשתף עם ההורים." },
  { n: 3, title: "מזמינים הכל", text: "עגלה אחת, תשלום אחד, משלוח אחד, מכל המותגים." },
];

// value = הערך שנשלח ל-?category=  ← התאימי לערכים האמיתיים בעמודת category ב-DB
const categories = [
  { label: "מצעים", value: "מצעים", Icon: BedDouble },
  { label: "מגבות", value: "מגבות", Icon: Layers },
  { label: "כלים לשולחן", value: "כלים לשולחן", Icon: CircleDot },
  { label: "אביזר למטבח", value: "אביזר למטבח", Icon: ShoppingBasket },
  { label: "מוצרי חשמל", value: "מוצרי חשמל", Icon: Plug },
  { label: "שעונים", value: "שעונים", Icon: Clock },
  { label: "מתנות", value: "מתנות", Icon: Gift },
];

const stats = [
  { n: "000+", t: "משפחות שכבר קנו" },
  { n: "000+", t: "חנויות ומותגים" },
  { n: "000+", t: "מוצרים באתר" },
];

// דוגמאות שיוצגו רק אם ה-API לא זמין
const fallbackProducts = Array.from({ length: 6 }, (_, i) => ({
  product_id: i + 1,
  product_name: "[שם מוצר]",
  category: "[מותג]",
  selling_price: "000",
  image: null,
}));

export default async function Home() {
  let products = [];
  try {
    products = await getProducts();
  } catch (err) {
    console.error("לא הצלחתי לטעון מוצרים מה-API, מציגה נתוני דוגמה:", err);
    products = fallbackProducts;
  }

  return (
    <>
      <Header />

      {/* Hero */}
      <section className="hero">
        <div className="wrap">
          <div className="hero-text">
            <div className="eyebrow">נדוניה באיכות ונוחות</div>
            <h1>
              כל הנדוניה שלכם,
              <span>במקום אחד</span>
            </h1>
            <div className="hero-cta">
              <a href="/products" className="pill pill-green">כניסה לחנות</a>
              <a href="#" className="pill pill-outline">הרשמה</a>
            </div>
          </div>
          <div className="hero-img">
            {/* כשתהיה תמונה: <img src="/hero.jpg" alt="" /> (שמרי אותה ב-public/hero.jpg) */}
            <ImageIcon size={56} strokeWidth={1.6} />
            <span>תמונה ראשית: תיווצר בהמשך</span>
          </div>
        </div>
      </section>

      {/* מותגים */}
      <section className="brands">
        <div className="wrap">
          <div className="sec-head">
            <div>
              <div className="eyebrow">המותגים שלנו</div>
              <h2 className="h2">מותגים מובילים, במקום אחד</h2>
            </div>
            <a href="#" className="link-all">לכל המותגים ←</a>
          </div>
          <div className="h-scroll">
            {brands.map((b) => (
              <div className="brand-card" key={b}>{b}</div>
            ))}
          </div>
        </div>
      </section>

      {/* איך זה עובד */}
      <section className="how">
        <div className="wrap">
          <div className="eyebrow">איך זה עובד</div>
          <h2 className="h2">שלושה צעדים. זה הכל.</h2>
          <div className="steps">
            {steps.map((s) => (
              <div className="step" key={s.n}>
                <div className="num">{s.n}</div>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* הנמכרים ביותר */}
      <BestSellers products={products} />

      {/* באנרים */}
      <section className="promos">
        <div className="wrap">
          <div className="promo dark">
            <h3>מבצעי העונה</h3>
            <p>הנחות על מותגים נבחרים</p>
            <a href="#" className="pill pill-gold pill-sm">לכל המבצעים</a>
          </div>
          <div className="promo light">
            <h3>חדש באתר</h3>
            <p>המוצרים האחרונים שהגיעו</p>
            <a href="#" className="pill pill-green pill-sm">לכל החדשים</a>
          </div>
        </div>
      </section>

      {/* קטגוריות */}
      <section className="cats">
        <div className="wrap">
          <div className="sec-head">
            <div>
              <div className="eyebrow">קטגוריות</div>
              <h2 className="h2">כל התכולה של הבית</h2>
            </div>
            <a href="/products" className="link-all">לכל המוצרים ←</a>
          </div>
          <div className="cat-grid">
            {categories.map(({ label, value, Icon }) => (
              <a className="cat-card" key={value} href={`/products?category=${encodeURIComponent(value)}`}>
                <span className="cat-icon"><Icon size={36} strokeWidth={1.8} /></span>
                <span className="label">{label}</span>
              </a>
            ))}
            <a className="cat-card all" href="/products">
              <span className="cat-icon"><ArrowLeft size={36} strokeWidth={1.8} /></span>
              <span className="label">כל הקטגוריות</span>
            </a>
          </div>
        </div>
      </section>

      {/* סטטיסטיקות */}
      <section className="stats">
        <div className="wrap">
          {stats.map((s) => (
            <div className="stat" key={s.t}>
              <div className="n">{s.n}</div>
              <div className="t">{s.t}</div>
            </div>
          ))}
        </div>
      </section>

      {/* תמיכה */}
      <section className="support">
        <div className="wrap">
          <div className="support-card">
            <div>
              <div className="eyebrow">תמיכה</div>
              <h2>יש שאלה, רעיון או בקשה? אנחנו כאן</h2>
              <div className="chips">
                <span className="chip"><CircleHelp size={22} /> לשאול</span>
                <span className="chip"><Lightbulb size={22} /> לשתף רעיון</span>
                <span className="chip"><ArrowLeft size={22} /> לבקש</span>
              </div>
            </div>
            <div className="support-actions">
              <a href="https://wa.me/972500000000" className="pill pill-gold">וואטסאפ</a>
              <a href="#" className="pill pill-outline-light">פנייה לתמיכה</a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}