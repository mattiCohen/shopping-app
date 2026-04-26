require("dotenv").config();

const express = require("express");
const cors = require("cors");
const pool = require("./db");

const app = express();

// middleware (always on top)
app.use(cors());
app.use(express.json());

// routes import
const customersRoutes = require("./routes/customers");
const addressesRoutes = require("./routes/addresses");
const companyRoutes = require("./routes/company");
const productRoutes = require("./routes/product");
const productInventoryRoutes = require("./routes/productInventory");
const shoppingCartRoutes = require("./routes/shoppingCart");
const shoppingHistoryRoutes = require("./routes/shoppingHistory");
const suppliersRoutes = require("./routes/suppliers");

app.use("/customers", customersRoutes);
app.use("/addresses", addressesRoutes);
app.use("/company", companyRoutes);
app.use("/product", productRoutes);
app.use("/product-inventory", productInventoryRoutes);
app.use("/shopping-cart", shoppingCartRoutes);
app.use("/shopping-history", shoppingHistoryRoutes);
app.use("/suppliers", suppliersRoutes);

// server
app.listen(5000, () => {
  console.log("Server running on port 5000");
});