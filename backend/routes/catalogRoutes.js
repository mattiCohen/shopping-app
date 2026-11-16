const express = require("express");
const router = express.Router();
const pool = require("../db");

// ⚠️ אם שמות הטבלאות/עמודות אצלך שונים, מתקנים רק כאן:
const COMPANIES = { table: "companies", id: "company_id", name: "name" };
const INVENTORY = { table: "product_inventories", productId: "product_id", qty: "quantity" };

const SORTS = {
  newest: "p.product_id DESC",
  price_asc: "p.selling_price ASC, p.product_id DESC",
  price_desc: "p.selling_price DESC, p.product_id DESC",
  name: "p.product_name ASC, p.product_id DESC",
};

const list = (v) => String(v || "").split(",").map((s) => s.trim()).filter(Boolean);
const intList = (v) => list(v).map(Number).filter(Number.isInteger);

function builder() {
  const values = [];
  const ph = (v) => {
    values.push(v);
    return `$${values.length}`;
  };
  return { values, ph };
}

async function catalog(req, res, next) {
  try {
    // ---------- עץ קטגוריות ----------
    const { rows: cats } = await pool.query(
      "SELECT category_id, name, parent_id FROM categories ORDER BY sort_order, category_id"
    );
    const byId = new Map(cats.map((c) => [c.category_id, c]));
    const childrenOf = new Map();
    cats.forEach((c) => {
      const key = c.parent_id ?? 0;
      if (!childrenOf.has(key)) childrenOf.set(key, []);
      childrenOf.get(key).push(c);
    });
    const descendants = (id) => {
      const out = [id];
      (childrenOf.get(id) || []).forEach((ch) => out.push(...descendants(ch.category_id)));
      return out;
    };

    const currentId = req.params.id === undefined ? null : Number(req.params.id);
    if (currentId !== null && !byId.has(currentId)) {
      return res.status(404).json({ error: "קטגוריה לא נמצאה" });
    }
    const isRoot = currentId === null;
    const treeIds = isRoot ? cats.map((c) => c.category_id) : descendants(currentId);

    const breadcrumb = [];
    for (let c = byId.get(currentId); c; c = byId.get(c.parent_id)) {
      breadcrumb.unshift({ category_id: c.category_id, name: c.name });
    }

    // ---------- סינונים ----------
    const { brand, color, type, min, max, inStock, q, sort } = req.query;
    const { values, ph } = builder();
    const where = ["TRUE"];

    if (!isRoot) where.push(`p.category_id = ANY(${ph(treeIds)}::int[])`);

    const typeIds = intList(type).filter((id) => treeIds.includes(id));
    const typeTree = [...new Set(typeIds.flatMap(descendants))];
    if (typeTree.length) where.push(`p.category_id = ANY(${ph(typeTree)}::int[])`);

    const brandIds = intList(brand);
    if (brandIds.length) where.push(`p.company_id = ANY(${ph(brandIds)}::int[])`);

    const colors = list(color);
    if (colors.length) where.push(`p.color = ANY(${ph(colors)}::text[])`);

    if (min !== undefined && min !== "" && !Number.isNaN(Number(min))) {
      where.push(`p.selling_price >= ${ph(Number(min))}`);
    }
    if (max !== undefined && max !== "" && !Number.isNaN(Number(max))) {
      where.push(`p.selling_price <= ${ph(Number(max))}`);
    }
    if (inStock === "1") where.push("COALESCE(inv.stock, 0) > 0");

    const search = String(q || "").trim();
    if (search) where.push(`p.product_name ILIKE ${ph(`%${search}%`)}`);

    const FROM = `
      FROM products p
      LEFT JOIN categories c ON c.category_id = p.category_id
      LEFT JOIN ${COMPANIES.table} co ON co.${COMPANIES.id} = p.company_id
      LEFT JOIN (
        SELECT ${INVENTORY.productId} AS product_id, SUM(${INVENTORY.qty}) AS stock
        FROM ${INVENTORY.table}
        GROUP BY ${INVENTORY.productId}
      ) inv ON inv.product_id = p.product_id`;
    const WHERE = where.join(" AND ");

    const limit = Math.min(Math.max(parseInt(req.query.limit) || 12, 1), 48);
    const offset = Math.max(parseInt(req.query.offset) || 0, 0);
    const orderBy = SORTS[sort] || SORTS.newest;

    // ---------- פאסטים (לפי הקטגוריה בלבד) ----------
    const f = builder();
    const fWhere = isRoot ? "TRUE" : `p.category_id = ANY(${f.ph(treeIds)}::int[])`;

    const [countRes, productsRes, brandsRes, colorsRes, priceRes, catCountRes] = await Promise.all([
      pool.query(`SELECT COUNT(*)::int AS total ${FROM} WHERE ${WHERE}`, values),
      pool.query(
        `SELECT p.product_id, p.product_name, p.selling_price, p.image, p.color,
                p.company_id, p.category_id, c.name AS category_name,
                co.${COMPANIES.name} AS brand_name,
                COALESCE(inv.stock, 0)::int AS stock
         ${FROM}
         WHERE ${WHERE}
         ORDER BY ${orderBy}
         LIMIT $${values.length + 1} OFFSET $${values.length + 2}`,
        [...values, limit, offset]
      ),
      pool.query(
        `SELECT co.${COMPANIES.id} AS id, co.${COMPANIES.name} AS name, COUNT(*)::int AS count
         FROM products p JOIN ${COMPANIES.table} co ON co.${COMPANIES.id} = p.company_id
         WHERE ${fWhere}
         GROUP BY co.${COMPANIES.id}, co.${COMPANIES.name}
         ORDER BY count DESC, name`,
        f.values
      ),
      pool.query(
        `SELECT p.color AS value, COUNT(*)::int AS count
         FROM products p
         WHERE ${fWhere} AND p.color IS NOT NULL AND p.color <> ''
         GROUP BY p.color ORDER BY count DESC, value`,
        f.values
      ),
      pool.query(
        `SELECT MIN(p.selling_price) AS min, MAX(p.selling_price) AS max
         FROM products p WHERE ${fWhere}`,
        f.values
      ),
      pool.query(
        `SELECT category_id, COUNT(*)::int AS n FROM products
         WHERE category_id IS NOT NULL GROUP BY category_id`
      ),
    ]);

    const countByCat = new Map(catCountRes.rows.map((r) => [r.category_id, r.n]));
    const children = (childrenOf.get(currentId || 0) || []).map((ch) => ({
      category_id: ch.category_id,
      name: ch.name,
      count: descendants(ch.category_id).reduce((s, id) => s + (countByCat.get(id) || 0), 0),
    }));

    res.json({
      category: isRoot ? null : { category_id: currentId, name: byId.get(currentId).name },
      breadcrumb,
      children,
      total: countRes.rows[0].total,
      products: productsRes.rows,
      facets: {
        brands: brandsRes.rows,
        colors: colorsRes.rows,
        price: {
          min: Math.floor(Number(priceRes.rows[0].min) || 0),
          max: Math.ceil(Number(priceRes.rows[0].max) || 0),
        },
      },
    });
  } catch (err) {
    next(err);
  }
}

router.get("/", catalog);
router.get("/:id", catalog);

module.exports = router;