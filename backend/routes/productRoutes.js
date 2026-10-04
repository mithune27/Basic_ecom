const express = require("express");

const {
  authenticateToken,
  requireAdmin
} = require("../middleware/authMiddleware");

function createProductRoutes(db) {
  const router = express.Router();

  // Get all products
  router.get("/", async (req, res) => {
    try {
      const products = await db.all(
        "SELECT * FROM products ORDER BY id DESC"
      );

      res.json(products);
    } catch (error) {
      res.status(500).json({
        message: "Failed to fetch products"
      });
    }
  });

  // Get one product
  router.get("/:id", async (req, res) => {
    try {
      const product = await db.get(
        "SELECT * FROM products WHERE id = ?",
        req.params.id
      );

      if (!product) {
        return res.status(404).json({
          message: "Product not found"
        });
      }

      res.json(product);
    } catch (error) {
      res.status(500).json({
        message: "Failed to fetch product"
      });
    }
  });

  // Add product
  router.post(
  "/",
  authenticateToken,
  requireAdmin,
  async (req, res) => {
    try {
      const {
        name,
        description,
        price,
        image,
        category,
        stock
      } = req.body;

      if (!name || price === undefined || stock === undefined) {
        return res.status(400).json({
          message: "Name, price and stock are required"
        });
      }

      const result = await db.run(
        `INSERT INTO products
        (name, description, price, image, category, stock)
        VALUES (?, ?, ?, ?, ?, ?)`,
        name,
        description || "",
        price,
        image || "",
        category || "",
        stock
      );

      res.status(201).json({
        message: "Product added successfully",
        productId: result.lastID
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Failed to add product"
      });
    }
  });

  return router;
}

module.exports = createProductRoutes;