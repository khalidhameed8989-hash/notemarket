const { pool } = require('../config/db');

// GET /api/products
const getProducts = async (req, res) => {
  try {
    const { category, search, sort = 'created_at', order = 'DESC', page = 1, limit = 12 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    let query = `
      SELECT p.*, c.name AS category_name, c.slug AS category_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE 1=1
    `;
    const params = [];

    if (category) {
      query += ' AND c.slug = ?';
      params.push(category);
    }

    if (search) {
      query += ' AND (p.title LIKE ? OR p.description LIKE ? OR p.subject LIKE ?)';
      const term = `%${search}%`;
      params.push(term, term, term);
    }

    const allowedSorts = ['created_at', 'price', 'rating', 'download_count'];
    const sortCol = allowedSorts.includes(sort) ? sort : 'created_at';
    const sortDir = order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
    query += ` ORDER BY p.${sortCol} ${sortDir}`;

    const [countResult] = await pool.query(
      `SELECT COUNT(*) as total FROM (${query}) AS sub`,
      params
    );
    const total = countResult[0].total;

    query += ' LIMIT ? OFFSET ?';
    params.push(parseInt(limit), offset);

    const [products] = await pool.query(query, params);

    res.json({
      products,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (err) {
    console.error('Get products error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
};

// GET /api/products/featured
const getFeaturedProducts = async (req, res) => {
  try {
    const [products] = await pool.query(`
      SELECT p.*, c.name AS category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.is_featured = TRUE
      ORDER BY p.created_at DESC
      LIMIT 6
    `);
    res.json(products);
  } catch (err) {
    console.error('Get featured error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
};

// GET /api/products/:id
const getProductById = async (req, res) => {
  try {
    const [products] = await pool.query(`
      SELECT p.*, c.name AS category_name, c.slug AS category_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.id = ?
    `, [req.params.id]);

    if (products.length === 0) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    const [reviews] = await pool.query(`
      SELECT r.*, u.name AS user_name
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      WHERE r.product_id = ?
      ORDER BY r.created_at DESC
      LIMIT 10
    `, [req.params.id]);

    res.json({ ...products[0], reviews });
  } catch (err) {
    console.error('Get product by id error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
};

// POST /api/products (admin only)
const createProduct = async (req, res) => {
  const { title, description, price, category_id, subject, pages, is_featured } = req.body;
  const pdf_file = req.file ? req.file.filename : null;

  try {
    const [result] = await pool.query(
      `INSERT INTO products (title, description, price, category_id, subject, pages, is_featured, pdf_file)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, description, price, category_id, subject, pages || 0, is_featured || false, pdf_file]
    );

    res.status(201).json({ message: 'Product created.', id: result.insertId });
  } catch (err) {
    console.error('Create product error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
};

// PUT /api/products/:id (admin only)
const updateProduct = async (req, res) => {
  const { title, description, price, category_id, subject, pages, is_featured } = req.body;

  try {
    await pool.query(
      `UPDATE products SET title=?, description=?, price=?, category_id=?, subject=?, pages=?, is_featured=?, updated_at=NOW()
       WHERE id=?`,
      [title, description, price, category_id, subject, pages, is_featured, req.params.id]
    );
    res.json({ message: 'Product updated.' });
  } catch (err) {
    console.error('Update product error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
};

// DELETE /api/products/:id (admin only)
const deleteProduct = async (req, res) => {
  try {
    await pool.query('DELETE FROM products WHERE id = ?', [req.params.id]);
    res.json({ message: 'Product deleted.' });
  } catch (err) {
    console.error('Delete product error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
};

module.exports = { getProducts, getFeaturedProducts, getProductById, createProduct, updateProduct, deleteProduct };
