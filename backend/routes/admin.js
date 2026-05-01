const express = require('express');
const { pool } = require('../config/db');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');
const router = express.Router();

router.use(authMiddleware);
router.use(adminMiddleware);

// GET all users
router.get('/users', async (req, res) => {
  try {
    const [users] = await pool.query(
      'SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC'
    );
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// GET all orders
router.get('/orders', async (req, res) => {
  try {
    const [orders] = await pool.query(`
      SELECT o.id, u.name, u.email, o.total, o.status, o.created_at
      FROM orders o
      JOIN users u ON o.user_id = u.id
      ORDER BY o.created_at DESC
    `);
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// GET stats
router.get('/stats', async (req, res) => {
  try {
    const [[{ totalUsers }]] = await pool.query('SELECT COUNT(*) as totalUsers FROM users');
    const [[{ totalOrders }]] = await pool.query('SELECT COUNT(*) as totalOrders FROM orders');
    const [[{ totalRevenue }]] = await pool.query('SELECT COALESCE(SUM(total), 0) as totalRevenue FROM orders WHERE status = "completed"');
    const [[{ totalProducts }]] = await pool.query('SELECT COUNT(*) as totalProducts FROM products');
    res.json({ totalUsers, totalOrders, totalRevenue, totalProducts });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;