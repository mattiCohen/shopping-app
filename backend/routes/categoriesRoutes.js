const express = require("express");
const router = express.Router();
const pool = require("../db"); // ← התאימי לקובץ שמייצא את החיבור ל-DB

// מחזיר עץ קטגוריות: [{ category_id, name, children: [...] }]
router.get("/", async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT category_id, name, parent_id FROM categories ORDER BY sort_order, category_id"
    );
    const byId = new Map(rows.map((r) => [r.category_id, { ...r, children: [] }]));
    const roots = [];
    byId.forEach((c) => {
      if (c.parent_id && byId.has(c.parent_id)) byId.get(c.parent_id).children.push(c);
      else roots.push(c);
    });
    res.json(roots);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "שגיאה בטעינת קטגוריות" });
  }
});

module.exports = router;