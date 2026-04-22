const express = require("express");
const cors = require("cors");
require('dotenv').config();
const app = express();
const pool = require("./db");
// middleware תמיד למעלה
app.use(cors());
app.use(express.json());
// הוסף את זה לקובץ הראשי (index.js)
app.get("/customers", async (req, res) => {
  try {
    // שליפת כל הנתונים מטבלת ה-customers בבסיס הנתונים
    const result = await pool.query("SELECT * FROM customers");
    
    // שליחת הנתונים בחזרה לדפדפן בפורמט JSON
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("שגיאה בשליפת הנתונים מהמסד");
  }
});
// routes
app.get("/", (req, res) => {
  res.send("Backend עובד 🚀");
});

app.get("/test-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json(result.rows);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// server
app.listen(5000, () => {
  console.log("Server running on port 5000");
});