const { pool } = require('../config/db');

// POST /api/orders/checkout
const checkout = async (req, res) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // Get cart items
    const [cartItems] = await conn.query(`
      SELECT c.product_id, p.price, p.title
      FROM cart c
      JOIN products p ON c.product_id = p.id
      WHERE c.user_id = ?
    `, [req.user.id]);

    if (cartItems.length === 0) {
      await conn.rollback();
      return res.status(400).json({ message: 'Cart is empty.' });
    }

    const total = cartItems.reduce((sum, item) => sum + parseFloat(item.price), 0);

    // Create order
    const [orderResult] = await conn.query(
      'INSERT INTO orders (user_id, total, status) VALUES (?, ?, ?)',
      [req.user.id, total.toFixed(2), 'completed']
    );
    const orderId = orderResult.insertId;

    // Create order items
    for (const item of cartItems) {
      await conn.query(
        'INSERT INTO order_items (order_id, product_id, price) VALUES (?, ?, ?)',
        [orderId, item.product_id, item.price]
      );
      await conn.query(
        'UPDATE products SET download_count = download_count + 1 WHERE id = ?',
        [item.product_id]
      );
    }

    // Clear cart
    await conn.query('DELETE FROM cart WHERE user_id = ?', [req.user.id]);

    await conn.commit();
    res.status(201).json({ message: 'Order placed successfully!', orderId, total: total.toFixed(2) });
  } catch (err) {
    await conn.rollback();
    console.error('Checkout error:', err);
    res.status(500).json({ message: 'Checkout failed. Please try again.' });
  } finally {
    conn.release();
  }
};

// GET /api/orders
const getMyOrders = async (req, res) => {
  try {
    const [orders] = await pool.query(`
      SELECT o.id, o.total, o.status, o.created_at,
             JSON_ARRAYAGG(JSON_OBJECT('title', p.title, 'price', oi.price)) AS items
      FROM orders o
      JOIN order_items oi ON o.id = oi.order_id
      JOIN products p ON oi.product_id = p.id
      WHERE o.user_id = ?
      GROUP BY o.id
      ORDER BY o.created_at DESC
    `, [req.user.id]);

    res.json(orders);
  } catch (err) {
    console.error('Get orders error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
};

// GET /api/orders/:id/download/:productId
const downloadProduct = async (req, res) => {
  try {
    const [access] = await pool.query(`
      SELECT p.pdf_file
      FROM order_items oi
      JOIN orders o ON oi.order_id = o.id
      JOIN products p ON oi.product_id = p.id
      WHERE o.id = ? AND oi.product_id = ? AND o.user_id = ? AND o.status = 'completed'
    `, [req.params.id, req.params.productId, req.user.id]);

    if (access.length === 0 || !access[0].pdf_file) {
      return res.status(403).json({ message: 'Access denied or file not found.' });
    }

    const filePath = `./uploads/${access[0].pdf_file}`;
    res.download(filePath);
  } catch (err) {
    console.error('Download error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
};

module.exports = { checkout, getMyOrders, downloadProduct };
