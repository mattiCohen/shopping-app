-- טבלת קטגוריות: parent_id ריק = קטגוריה ראשית
CREATE TABLE categories (
  category_id SERIAL PRIMARY KEY,
  name        TEXT NOT NULL,
  parent_id   INT REFERENCES categories(category_id) ON DELETE SET NULL,
  sort_order  INT NOT NULL DEFAULT 0
);
CREATE INDEX idx_categories_parent ON categories(parent_id);
-- שם ייחודי בתוך אותו אב
CREATE UNIQUE INDEX uq_categories_name ON categories (COALESCE(parent_id, 0), name);

-- קטגוריות ראשיות
INSERT INTO categories (name, sort_order) VALUES
  ('מצעים',1),('מגבות',2),('כלים לשולחן',3),('אביזר למטבח',4),
  ('מוצרי חשמל',5),('שעונים',6),('מתנות',7),('כלי כסף',8),('ריהוט',9);

-- תתי קטגוריות
INSERT INTO categories (name, parent_id, sort_order)
SELECT v.name, p.category_id, v.ord
FROM (VALUES
  ('סטים','מצעים',1),('שמיכות','מצעים',2),('כריות','מצעים',3),
  ('רחצה','מגבות',1),('מטבח','מגבות',2),('אירוח','מגבות',3),
  ('צלחות','כלים לשולחן',1),('כוסות','כלים לשולחן',2),('סכו"ם','כלים לשולחן',3),('מפות','כלים לשולחן',4),
  ('סירים','אביזר למטבח',1),('מחבתות','אביזר למטבח',2),('כלי עבודה','אביזר למטבח',3),
  ('קטנים','מוצרי חשמל',1),('גדולים','מוצרי חשמל',2),
  ('קיר','שעונים',1),('שולחן','שעונים',2),
  ('לחתן','מתנות',1),('לכלה','מתנות',2)
) AS v(name, parent, ord)
JOIN categories p ON p.name = v.parent AND p.parent_id IS NULL;