const bcrypt = require("bcryptjs");
const connectDatabase = require("./database/database");

async function createAdmin() {
  const db = await connectDatabase();

  const password = await bcrypt.hash(
    "admin123",
    10
  );

  const existingAdmin = await db.get(
    "SELECT id FROM users WHERE email = ?",
    "admin@example.com"
  );

  if (existingAdmin) {
    console.log("Admin already exists");
    return;
  }

  await db.run(
    `INSERT INTO users
    (name, email, password, role)
    VALUES (?, ?, ?, ?)`,
    "Admin",
    "admin@example.com",
    password,
    "admin"
  );

  console.log("Admin created successfully");
}

createAdmin();