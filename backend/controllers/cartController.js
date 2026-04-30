const { pool } = require('../config/db');

// GET /api/cart
const getCart = async (req, res) => {
  try {
    const [items] = await pool.query(`
      SELECT c.id as cart_id, p.id, p.title, p.price, p.subject, p.pages, p.preview_images
      FROM cart c
      JOIN products p ON c.product_id = p.id
      WHERE c.user_id = ?
    `, [req.user.id]);

    const total = items.reduce((sum, item) => sum + parseFloat(item.price), 0);
    res.json({ items, total: total.toFixed(2) });
  } catch (err) {
    console.error('Get cart error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
};

// POST /api/cart
const addToCart = async (req, res) => {
  const { product_id } = req.body;

  try {
    const [products] = await pool.query('SELECT id FROM products WHERE id = ?', [product_id]);
    if (products.length === 0) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    await pool.query(
      'INSERT IGNORE INTO cart (user_id, product_id) VALUES (?, ?)',
      [req.user.id, product_id]
    );

    res.status(201).json({ message: 'Added to cart.' });
  } catch (err) {
    console.error('Add to cart error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
};

// DELETE /api/cart/:productId
const removeFromCart = async (req, res) => {
  try {
    await pool.query(
      'DELETE FROM cart WHERE user_id = ? AND product_id = ?',
      [req.user.id, req.params.productId]
    );
    res.json({ message: 'Removed from cart.' });
  } catch (err) {
    console.error('Remove from cart error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
};

// DELETE /api/cart
const clearCart = async (req, res) => {
  try {
    await pool.query('DELETE FROM cart WHERE user_id = ?', [req.user.id]);
    res.json({ message: 'Cart cleared.' });
  } catch (err) {
    console.error('Clear cart error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
};

module.exports = { getCart, addToCart, removeFromCart, clearCart };
