const express = require('express');
const router = express.Router();
const Book = require('../models/Book');
//http://192.168.56.1:3100/api/books
// 获取所有书籍
router.get('/', async (req, res) => {
    try {
        const books = await Book.find();
        res.json(books);
    } catch (err) {
        res.status(500).json({message: err.message});
    }
});

// 创建新书
router.post('/', async (req, res) => {
    const book = new Book({
        title: req.body.title,
        author: req.body.author,
        year: req.body.year
    });

    try {
        const newBook = await book.save();
        res.status(201).json(newBook);
    } catch (err) {
        res.status(400).json({message: err.message});
    }
});

router.get('/rank', async (req, res) => {
    try {
        const ranking = await Book.find()
            .sort({saleCount: -1})
            .limit(10)
            .select('title author saleCount');
        res.json(ranking);
    } catch (err) {
        res.status(500).json({message: err.message});
    }
});
module.exports = router;
