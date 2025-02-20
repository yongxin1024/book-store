const express = require('express');
const router = express.Router();
const Book = require('../models/Book');
const Order = require('../models/Order');

// 创建订单
router.post('/', async (req, res) => {
    try {
        const { bookId, quantity } = req.body;

        // 验证书籍是否存在
        const book = await Book.findById(bookId);
        if (!book) return res.status(404).json({ message: 'Book not found' });

        // 创建订单
        const order = new Order({ book: bookId, quantity });
        await order.save();

        // 更新销量
        await Book.findByIdAndUpdate(bookId, {
            $inc: { saleCount: quantity }
        });

        // 触发 WebSocket 事件，通知前端刷新
        req.app.get('io').emit('orderPlaced', { message: 'New order placed, refresh the list!' });

        res.status(201).json(order);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
