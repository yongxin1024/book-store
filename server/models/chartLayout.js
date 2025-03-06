const mongoose = require('mongoose');

const chartLayoutSchema = new mongoose.Schema({
    positions: {
        type: [String],
        default: ['bar', 'pie']
    }
});

module.exports = mongoose.model('ChartLayout', chartLayoutSchema);