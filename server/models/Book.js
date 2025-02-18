const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: {type: String, required: true},
    author: {type: String, required: true},
    year: {type: Number, required: true},
    saleCount: {type: Number, default: 0}
});

module.exports = mongoose.model('Book', bookSchema);
