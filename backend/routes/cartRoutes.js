const express = require("express");

const {
  authenticateToken
} = require("../middleware/authMiddleware");

function createCartRoutes(db) {
  const router = express.Router();

  // Get current user's cart
  router.get(
    "/",
    authenticateToken,
    async (req, res) => {
      try {
        const cartItems = await db.all(
          `SELECT
            cart.id,
            cart.product_id,
            cart.quantity,
            products.name,
            products.price,
            products.image,
            products.stock
          FROM cart
          JOIN products
            ON cart.product_id = products.id
          WHERE cart.user_id = ?`,
          req.user.id
        );

        res.json(cartItems);
      } catch (error) {
        res.status(500).json({
          message: "Failed to get cart"
        });
      }
    }
  );

  // Add product to cart
  router.post(
    "/",
    authenticateToken,
    async (req, res) => {
      try {
        const { productId, quantity } = req.body;

        if (!productId) {
          return res.status(400).json({
            message: "Product ID is required"
          });
        }

        const product = await db.get(
          "SELECT * FROM products WHERE id = ?",
          productId
        );

        if (!product) {
          return res.status(404).json({
            message: "Product not found"
          });
        }

        const existingItem = await db.get(
          `SELECT * FROM cart
           WHERE user_id = ? AND product_id = ?`,
          req.user.id,
          productId
        );

        const newQuantity =
          existingItem
            ? existingItem.quantity + (quantity || 1)
            : (quantity || 1);

        if (newQuantity > product.stock) {
          return res.status(400).json({
            message: "Requested quantity exceeds stock"
          });
        }

        if (existingItem) {
          await db.run(
            `UPDATE cart
             SET quantity = ?
             WHERE user_id = ? AND product_id = ?`,
            newQuantity,
            req.user.id,
            productId
          );
        } else {
          await db.run(
            `INSERT INTO cart
             (user_id, product_id, quantity)
             VALUES (?, ?, ?)`,
            req.user.id,
            productId,
            newQuantity
          );
        }

        res.json({
          message: "Product added to cart"
        });
      } catch (error) {
        console.error(error);

        res.status(500).json({
          message: "Failed to add product to cart"
        });
      }
    }
  );

  return router;
}

module.exports = createCartRoutes;