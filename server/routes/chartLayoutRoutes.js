const express = require('express');
const router = express.Router();
const ChartLayout = require('../models/chartLayout');

router.get('/layout', async (req, res) => {
    try {
        const layout = await ChartLayout.findOne();
        res.json(layout ? layout.positions : ['bar', 'pie']);
    } catch (error) {
        res.status(500).json({ message: '获取布局失败' });
    }
});

router.post('/layout', async (req, res) => {
    try {
        await ChartLayout.findOneAndUpdate(
            {},
            { positions: req.body.positions },
            { upsert: true }
        );
        res.json({ message: '布局保存成功' });
    } catch (error) {
        res.status(500).json({ message: '保存布局失败' });
    }
});

module.exports = router;