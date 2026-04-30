const { pool } = require('../config/db');

// GET /api/categories
const getCategories = async (req, res) => {
  try {
    const [categories] = await pool.query(`
      SELECT c.*, COUNT(p.id) AS product_count
      FROM categories c
      LEFT JOIN products p ON p.category_id = c.id
      GROUP BY c.id
      ORDER BY c.name ASC
    `);
    res.json(categories);
  } catch (err) {
    console.error('Get categories error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
};

module.exports = { getCategories };
