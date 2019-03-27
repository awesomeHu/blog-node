const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');

//Blog model

const blogSchema = new mongoose.Schema({
    author: { type: String, required: true, default: 'Admin' },
    blog_title: { type: String, required: true },
    blog_content: { type: String, required: true },
    blog_comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment', required: true }],
    category: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true }],
    create_time: { type: Date, default: Date.now },
    update_time: { type: Date, default: Date.now },
    like_users: [{
        user_id: Number,
        user_name: String,
        email: String,
        create_time: { type: Date, default: Date.now }
    }],

    meta: {
        likes: { type: Number, default: 0 },
        comments: { type: Number, default: 0 },
        views: { type: Number, default: 0 }
    }
})

// blogSchema.plugin(autoIncrement.plugin, {
//     model: 'Blog',
//     field: 'id',
//     startAt: 1,
//     incrementBy: 1
// })

module.exports = mongoose.model('Blog', blogSchema)