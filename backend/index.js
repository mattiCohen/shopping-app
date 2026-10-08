require("dotenv").config();

const express = require("express");
const cors = require("cors");
const pool = require("./db");
const errorHandler = require("./middleware/errorHandler");
const app = express();
const path = require("path"); 

// middleware (always on top)
app.use(cors());
app.use(express.json());
app.use("/images", express.static(path.join(__dirname, "images")));

// routes import
const customersRoutes = require("./routes/customersRoutes");
const addressesRoutes = require("./routes/addressesRoutes");
const companiesRoutes = require("./routes/companiesRoutes");
const productsRoutes = require("./routes/productsRoutes");
const productInventoriesRoutes = require("./routes/productInventoriesRoutes");
const shoppingCartsRoutes = require("./routes/shoppingCartsRoutes");
const suppliersRoutes = require("./routes/suppliersRoutes");
const authRoutes = require("./routes/authRoutes"); 
const orderRoutes = require("./routes/ordersRoutes");
const cartItemsRoutes = require("./routes/cartItemsRoutes");

app.use("/customers", customersRoutes);
app.use("/addresses", addressesRoutes);
app.use("/companies", companiesRoutes);
app.use("/products", productsRoutes);
app.use("/product-inventories", productInventoriesRoutes);
app.use("/shopping-carts", shoppingCartsRoutes);
app.use("/suppliers", suppliersRoutes);
app.use('/api/auth', authRoutes);
app.use("/orders", orderRoutes);
app.use("/cart-items", cartItemsRoutes);

app.use(errorHandler);

// server
app.listen(5000, () => {
  console.log("Server running on port 5000");
});