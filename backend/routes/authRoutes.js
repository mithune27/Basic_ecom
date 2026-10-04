const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const {
  authenticateToken,
  requireAdmin
} = require("../middleware/authMiddleware");

function createAuthRoutes(db) {
  const router = express.Router();

  // Register
  router.post("/register", async (req, res) => {
    try {
      const { name, email, password } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({
          message: "All fields are required"
        });
      }

      const existingUser = await db.get(
        "SELECT id FROM users WHERE email = ?",
        email
      );

      if (existingUser) {
        return res.status(400).json({
          message: "Email already registered"
        });
      }

      const hashedPassword = await bcrypt.hash(
        password,
        10
      );

      const result = await db.run(
        `INSERT INTO users
        (name, email, password)
        VALUES (?, ?, ?)`,
        name,
        email,
        hashedPassword
      );

      res.status(201).json({
        message: "Registration successful",
        userId: result.lastID
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Registration failed"
      });
    }
  });

  // Login
  router.post("/login", async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          message: "Email and password are required"
        });
      }

      const user = await db.get(
        "SELECT * FROM users WHERE email = ?",
        email
      );

      if (!user) {
        return res.status(401).json({
          message: "Invalid email or password"
        });
      }

      const passwordMatch = await bcrypt.compare(
        password,
        user.password
      );

      if (!passwordMatch) {
        return res.status(401).json({
          message: "Invalid email or password"
        });
      }

      const token = jwt.sign(
        {
          id: user.id,
          role: user.role
        },
        "ecommerce_secret_key",
        {
          expiresIn: "1d"
        }
      );

      res.json({
        message: "Login successful",
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Login failed"
      });
    }
  });

  // Get all customers - Admin only
  router.get(
    "/customers",
    authenticateToken,
    requireAdmin,
    async (req, res) => {
      try {
        const customers = await db.all(
          `SELECT
            id,
            name,
            email
           FROM users
           WHERE role = 'user'
           ORDER BY id DESC`
        );

        res.json(customers);
      } catch (error) {
        console.error(error);

        res.status(500).json({
          message: "Failed to get customers"
        });
      }
    }
  );

  return router;
}

module.exports = createAuthRoutes;