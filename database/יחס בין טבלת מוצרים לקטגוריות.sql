ALTER TABLE products ADD COLUMN category_id INT REFERENCES categories(category_id);

-- מיגרציה ראשונית מהטקסט הישן (מתאימה לפי שם קטגוריה ראשית)
UPDATE products p SET category_id = c.category_id
FROM categories c
WHERE c.name = p.category AND c.parent_id IS NULL;

-- מוצרים שלא הותאמו (ערכים ישנים כמו "טקסטיל" שאין להם קטגוריה חדשה)
SELECT DISTINCT category FROM products WHERE category_id IS NULL;