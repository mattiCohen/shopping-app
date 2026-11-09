import { MessageCircle } from "../components/Icons";

export default function ListFooter({ categories = [] }) {
    return (
    <>
      <footer className="wl-footer">
        <div className="wl-wrap">
          <div className="wl-foot-grid">
            <div>
              <div className="wl-foot-logo">
                נדונ<span>ליין</span>
              </div>
              <p className="wl-foot-tag">כל מה שזוג צריך, ברשימה אחת. הכל מגיע ממחסן אחד, במשלוח אחד.</p>
            </div>

            <div className="wl-foot-col">
              <h4>כל הקטגוריות</h4>
              <ul className="wl-foot-cats">
               {categories.map((c) => (
  <li key={c.category_id}>
    <a href={`/products?category=${c.category_id}`}>{c.name}</a>
  </li>
))}
              </ul>
            </div>

            <div className="wl-foot-col">
              <h4>האתר</h4>
              <ul>
                <li><a href="#">אודות</a></li>
                <li><a href="#">אזור אישי</a></li>
                <li><a href="/my-list">הרשימה שלי</a></li>
                <li><a href="#">שאלות נפוצות</a></li>
              </ul>
            </div>

            <div className="wl-foot-col">
              <h4>מידע</h4>
              <ul>
                <li><a href="#">משלוחים</a></li>
                <li><a href="#">מדיניות החזרות והחלפות</a></li>
                <li><a href="#">תנאי שימוש</a></li>
                <li><a href="#">הצהרת נגישות</a></li>
                <li><a href="#">צור קשר</a></li>
              </ul>
            </div>
          </div>

          <div className="wl-contact">
            <div>
              <h4>יש שאלה? רוצים לשתף או להציע?</h4>
              <p>כתבו לנו ונחזור אליכם.</p>
            </div>
            <a href="/contact">שליחת הודעה</a>
          </div>

          <div className="wl-copy">© נדונליין. כל הזכויות שמורות.</div>
        </div>
      </footer>

      {/* החליפי למספר האמיתי בפורמט בינלאומי בלי פלוס */}
      <a className="wl-wa" href="https://wa.me/972500000000" aria-label="וואטסאפ">
        <MessageCircle size={40} />
      </a>
    </>
  );
}