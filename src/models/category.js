const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');

//Category model

const categorySchema = new mongoose.Schema({
    name: String,
    create_time: { type: Date, default: Date.now },
    update_time: { type: Date, default: Date.now }
})

// categorySchema.plugin(autoIncrement.plugin, {
//     model: 'Category',
//     field: 'id',
//     startAt: 1,
//     incrementBy: 1
// })

module.exports = mongoose.model('Category', categorySchema)