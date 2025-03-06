const express = require('express');
const router = express.Router();
const Book = require('../models/Book');
const Rating = require('../models/Rating');

// ... 其他路由 ...

// 添加书籍评分
router.post('/', async (req, res) => {
    try {
        const { bookId, rating, comment } = req.body;

        const newRating = new Rating({
            book: bookId,
            rating,
            comment
        });

        await newRating.save();

        // 更新书籍的平均评分
        const ratings = await Rating.find({ book: bookId });
        const averageRating = ratings.reduce((acc, curr) => acc + curr.rating, 0) / ratings.length;

        await Book.findByIdAndUpdate(bookId, {
            $set: { averageRating }
        });

        res.status(201).json({ message: '评价提交成功' });
    } catch (error) {
        console.error('评价提交失败:', error);
        res.status(500).json({ message: '评价提交失败' });
    }
});

module.exports = router;