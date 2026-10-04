

const express = require("express");

const {
  authenticateToken,
  requireAdmin
} = require("../middleware/authMiddleware");
function createOrderRoutes(db) {
  const router = express.Router();

  // Place order
  router.post(
    "/",
    authenticateToken,
    async (req, res) => {
      try {
        const {
          customerName,
          address,
          phone
        } = req.body;

        if (!customerName || !address || !phone) {
          return res.status(400).json({
            message: "All customer details are required"
          });
        }

        const cartItems = await db.all(
          `SELECT
            cart.product_id,
            cart.quantity,
            products.price,
            products.stock
          FROM cart
          JOIN products
            ON cart.product_id = products.id
          WHERE cart.user_id = ?`,
          req.user.id
        );

        if (cartItems.length === 0) {
          return res.status(400).json({
            message: "Your cart is empty"
          });
        }

        for (const item of cartItems) {
          if (item.quantity > item.stock) {
            return res.status(400).json({
              message: "Some products are out of stock"
            });
          }
        }

        const totalAmount = cartItems.reduce(
          (total, item) =>
            total + item.price * item.quantity,
          0
        );

        const order = await db.run(
          `INSERT INTO orders
          (
            user_id,
            customer_name,
            address,
            phone,
            total_amount,
            payment_method,
            status
          )
          VALUES (?, ?, ?, ?, ?, ?, ?)`,
          req.user.id,
          customerName,
          address,
          phone,
          totalAmount,
          "Cash on Delivery",
          "Placed"
        );

        const orderId = order.lastID;

        for (const item of cartItems) {
          await db.run(
            `INSERT INTO order_items
            (
              order_id,
              product_id,
              quantity,
              price
            )
            VALUES (?, ?, ?, ?)`,
            orderId,
            item.product_id,
            item.quantity,
            item.price
          );

          await db.run(
            `UPDATE products
             SET stock = stock - ?
             WHERE id = ?`,
            item.quantity,
            item.product_id
          );
        }

        await db.run(
          "DELETE FROM cart WHERE user_id = ?",
          req.user.id
        );

        res.status(201).json({
          message: "Order placed successfully",
          orderId,
          totalAmount,
          paymentMethod: "Cash on Delivery"
        });

      } catch (error) {
        console.error(error);

        res.status(500).json({
          message: "Failed to place order"
        });
      }
    }
  );
  // Get current user's orders
router.get(
  "/",
  authenticateToken,
  async (req, res) => {
    try {
      const orders = await db.all(
        `SELECT *
         FROM orders
         WHERE user_id = ?
         ORDER BY created_at DESC`,
        req.user.id
      );

      for (const order of orders) {
        order.items = await db.all(
          `SELECT
            order_items.product_id,
            order_items.quantity,
            order_items.price,
            products.name,
            products.image
           FROM order_items
           JOIN products
             ON order_items.product_id = products.id
           WHERE order_items.order_id = ?`,
          order.id
        );
      }

      res.json(orders);
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Failed to get orders"
      });
    }
  }
);
// Get all orders for admin
router.get(
  "/admin",
  authenticateToken,
  requireAdmin,
  async (req, res) => {
    try {
      const orders = await db.all(
        `SELECT
          orders.id,
          orders.user_id,
          orders.customer_name,
          orders.address,
          orders.phone,
          orders.total_amount,
          orders.payment_method,
          orders.status,
          orders.created_at,
          users.email
         FROM orders
         JOIN users
           ON orders.user_id = users.id
         ORDER BY orders.created_at DESC`
      );

      for (const order of orders) {
        order.items = await db.all(
          `SELECT
            order_items.product_id,
            order_items.quantity,
            order_items.price,
            products.name
           FROM order_items
           JOIN products
             ON order_items.product_id = products.id
           WHERE order_items.order_id = ?`,
          order.id
        );
      }

      res.json(orders);
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Failed to get orders"
      });
    }
  }
);

  return router;
}

module.exports = createOrderRoutes;