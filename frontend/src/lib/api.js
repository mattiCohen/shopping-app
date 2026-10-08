// כל הקריאות ל-Express API שלך מרוכזות כאן, כדי שיהיה מקום אחד לשנות
// אם משנים endpoint או מבנה תשובה.

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// GET /products?category=...&product_name=... וכו', תואם ל-fetchProductsByFilters שלך
export async function getProducts(filters = {}) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      params.append(key, String(value));
    }
  });

  const query = params.toString();
  const res = await fetch(`${API_URL}/products${query ? `?${query}` : ""}`, {
    // דף הבית ירצה נתונים טריים; אפשר להחליף ל-revalidate אם רוצים caching
    cache: "no-store",
  });

  if (res.status === 404) {
    // ה-controller שלך מחזיר 404 כשאין תוצאות תואמות
    return [];
  }
  if (!res.ok) {
    throw new Error(`שגיאה בטעינת מוצרים: ${res.status}`);
  }
  return res.json();
}

// GET /products/:id
export async function getProductById(id) {
  const res = await fetch(`${API_URL}/products/${id}`, { cache: "no-store" });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`שגיאה בטעינת מוצר: ${res.status}`);
  return res.json();
}

// ממיר path כמו "images/169....jpg" שחוזר מה-DB לכתובת URL מלאה
// מניח ש-Express מגיש את התיקייה סטטית: app.use("/images", express.static("images"))
export function getImageUrl(imagePath) {
  if (!imagePath) return null;
  if (imagePath.startsWith("http")) return imagePath;
  const cleanPath = imagePath.replace(/^images[\\/]/, "");
  return `${API_URL}/images/${cleanPath}`;
}

export function formatPrice(price) {
  const num = typeof price === "string" ? parseFloat(price) : price;
  return `${num.toLocaleString("he-IL")} ₪`;
}
