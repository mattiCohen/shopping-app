import "../my-list/list.css";
import "./products.css";
import ShopHeader from "./ShopHeader";
import ListFooter from "../my-list/ListFooter";
import CatalogView from "./CatalogView";
import { getCatalog, getCategories } from "../../lib/api";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 12;
const pick = (v) => (Array.isArray(v) ? v[0] : v) || "";

export default async function ProductsPage({ searchParams }) {
  const sp = (await searchParams) || {};

  const rawCategory = pick(sp.category);
  const category = /^\d+$/.test(rawCategory) ? rawCategory : null;

  const filters = {
    type: pick(sp.type),
    brand: pick(sp.brand),
    color: pick(sp.color),
    min: pick(sp.min),
    max: pick(sp.max),
    inStock: pick(sp.inStock),
    sort: pick(sp.sort),
    q: pick(sp.q),
  };

  let data = null;
  let categories = [];
  let failed = false;
  try {
    [data, categories] = await Promise.all([
      getCatalog(category, { ...filters, limit: PAGE_SIZE, offset: 0 }),
      getCategories().catch(() => []),
    ]);
  } catch (err) {
    console.error("לא הצלחתי לטעון מוצרים:", err);
    failed = true;
  }

  const activeId = data?.breadcrumb?.[0]?.category_id ?? null;

  return (
    <div className="wl-page">
      <ShopHeader categories={categories} activeId={activeId} q={filters.q} />
      <main className="wl-wrap">
        {failed ? (
          <p className="wl-empty">לא הצלחנו לטעון את המוצרים. נסו שוב בעוד רגע.</p>
        ) : !data ? (
          <p className="wl-empty">הקטגוריה לא נמצאה.</p>
        ) : (
          <CatalogView
            key={JSON.stringify([category, filters])}
            data={data}
            filters={filters}
            categoryId={category}
            pageSize={PAGE_SIZE}
          />
        )}
      </main>
      <ListFooter categories={categories} />
    </div>
  );
}