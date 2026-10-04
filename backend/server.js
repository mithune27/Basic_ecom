const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");

const connectDatabase = require("./database/database");
const createAuthRoutes = require("./routes/authRoutes");
const createProductRoutes = require("./routes/productRoutes");
const createCartRoutes = require("./routes/cartRoutes");
const createOrderRoutes = require("./routes/orderRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({
    message: "E-commerce API is running"
  });
});

async function createAdmin(db) {
  const existingAdmin = await db.get(
    "SELECT id FROM users WHERE email = ?",
    "admin@example.com"
  );

  if (existingAdmin) {
    return;
  }

  const password = await bcrypt.hash(
    "admin123",
    10
  );

  await db.run(
    `INSERT INTO users
    (name, email, password, role)
    VALUES (?, ?, ?, ?)`,
    "Admin",
    "admin@example.com",
    password,
    "admin"
  );

  console.log("Admin account created");
}

async function startServer() {
  try {
    const db = await connectDatabase();

    console.log("Database connected successfully");

    await createAdmin(db);

    app.use("/api/auth", createAuthRoutes(db));
    app.use("/api/products", createProductRoutes(db));
    app.use("/api/cart", createCartRoutes(db));
    app.use("/api/orders", createOrderRoutes(db));

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
  }
}

startServer();