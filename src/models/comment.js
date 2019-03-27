const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');

//Comment model

const commentSchema = mongoose.Schema({
    comment_id: String,
    blog_id: String,
    user_id: { type: String, reqiured: true },
    user_name: { type: String, reqiured: true },
    comment_content: { type: String, reqiured: true },
    create_time: { type: Date, default: Date.now },

    parent_id: { type: String, reqiured: false },
    target_name: { type: String, reqiured: false }
})

// commentSchema.plugin(autoIncrement.plugin, {
//     model: 'Comment',
//     field: 'comment_id',
//     startAt: 1,
//     incrementBy: 1
// })

module.exports = mongoose.model('Comment', commentSchema)