const express = require('express');
const { checkout, getMyOrders, downloadProduct } = require('../controllers/orderController');
const { authMiddleware } = require('../middleware/auth');
const router = express.Router();

router.use(authMiddleware);

router.post('/checkout', checkout);
router.get('/', getMyOrders);
router.get('/:id/download/:productId', downloadProduct);

module.exports = router;
