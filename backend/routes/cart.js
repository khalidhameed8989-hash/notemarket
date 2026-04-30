const express = require('express');
const { getCart, addToCart, removeFromCart, clearCart } = require('../controllers/cartController');
const { authMiddleware } = require('../middleware/auth');
const router = express.Router();

router.use(authMiddleware);

router.get('/', getCart);
router.post('/', addToCart);
router.delete('/clear', clearCart);
router.delete('/:productId', removeFromCart);

module.exports = router;
