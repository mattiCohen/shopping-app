// import { MessageCircle } from "./Icons";

// const columns = [
//   [
//     { title: "מצעים", links: ["סטים", "שמיכות", "כריות"] },
//     { title: "מגבות", links: ["רחצה", "מטבח", "אירוח"] },
//   ],
//   [
//     { title: "כלים לשולחן", links: ["צלחות", "כוסות", 'סכו"ם', "מפות"] },
//     { title: "אביזר למטבח", links: ["סירים", "מחבתות", "כלי עבודה"] },
//   ],
//   [
//     { title: "מוצרי חשמל", links: ["קטנים", "גדולים"] },
//     { title: "שעונים", links: ["קיר", "שולחן"] },
//   ],
//   [
//     { title: "מתנות", links: ["לחתן", "לכלה"] },
//     { title: "כלי כסף", links: [] },
//     { title: "ריהוט", links: [] },
//   ],
// ];

// const info = [
//   "האזור האישי", "אודות", "צור קשר", "שאלות נפוצות", "משלוחים",
//   "מדיניות החלפה והחזרה", "תנאי שימוש", "מדיניות פרטיות", "הצהרת נגישות",
// ];

// export default function Footer() {
//   return (
//     <>
//       <footer className="footer">
//         <div className="wrap">
//           <div className="foot-grid">
//             <div className="foot-brand">
//               <div className="logo">נדונליין</div>
//               <p>נדוניה באיכות ונוחות</p>
//             </div>

//             {columns.map((col, i) => (
//               <div className="foot-col" key={i}>
//                 {col.map((group) => (
//                   <div key={group.title}>
//                     <h4>{group.title}</h4>
//                     <ul>
//                       {group.links.map((l) => (
//                         <li key={l}><a href="#">{l}</a></li>
//                       ))}
//                     </ul>
//                   </div>
//                 ))}
//               </div>
//             ))}

//             <div className="foot-col info">
//               <h4>מידע ושירות</h4>
//               <ul>
//                 {info.map((l) => (
//                   <li key={l}><a href="#">{l}</a></li>
//                 ))}
//               </ul>
//             </div>
//           </div>

//           <div className="foot-bottom">
//             <span>© 2026 נדונליין. כל הזכויות שמורות</span>
//             <span>השפות: עברית · English · Français · Español</span>
//           </div>
//         </div>
//       </footer>

//       {/* החליפי למספר הווטסאפ האמיתי, בפורמט בינלאומי בלי + (למשל 972501234567) */}
//       <a className="wa-float" href="https://wa.me/972500000000" aria-label="וואטסאפ">
//         <MessageCircle size={38} />
//       </a>
//     </>
//   );
// }

import { MessageCircle } from "./Icons";
import { getCategories } from "../../lib/api";

const info = [
  "האזור האישי", "אודות", "צור קשר", "שאלות נפוצות", "משלוחים",
  "מדיניות החלפה והחזרה", "תנאי שימוש", "מדיניות פרטיות", "הצהרת נגישות",
];

// מחלק את הקטגוריות הראשיות ל-4 עמודות
function splitToColumns(items, count = 4) {
  const size = Math.ceil(items.length / count) || 1;
  return Array.from({ length: count }, (_, i) => items.slice(i * size, (i + 1) * size));
}

const catHref = (id) => `/products?category=${id}`;

export default async function Footer() {
  let categories = [];
  try {
    categories = await getCategories();
  } catch (err) {
    console.error("לא הצלחתי לטעון קטגוריות לפוטר:", err);
  }
  const columns = splitToColumns(categories);

  return (
    <>
      <footer className="footer">
        <div className="wrap">
          <div className="foot-grid">
            <div className="foot-brand">
              <div className="logo">נדונליין</div>
              <p>נדוניה באיכות ונוחות</p>
            </div>

            {columns.map((col, i) => (
              <div className="foot-col" key={i}>
                {col.map((cat) => (
                  <div key={cat.category_id}>
                    <h4><a href={catHref(cat.category_id)}>{cat.name}</a></h4>
                    <ul>
                      {cat.children.map((sub) => (
                        <li key={sub.category_id}>
                          <a href={catHref(sub.category_id)}>{sub.name}</a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ))}

            <div className="foot-col info">
              <h4>מידע ושירות</h4>
              <ul>
                {info.map((l) => (
                  <li key={l}><a href="#">{l}</a></li>
                ))}
              </ul>
            </div>
          </div>

          <div className="foot-bottom">
            <span>© 2026 נדונליין. כל הזכויות שמורות</span>
            <span>השפות: עברית · English · Français · Español</span>
          </div>
        </div>
      </footer>

      <a className="wa-float" href="https://wa.me/972500000000" aria-label="וואטסאפ">
        <MessageCircle size={38} />
      </a>
    </>
  );
}