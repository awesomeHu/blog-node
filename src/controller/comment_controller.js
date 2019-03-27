const responseClient = require('../util/util').responseClient
const Comment = require('../models/comment.js')
const Blog = require('../models/blog.js')

//Add new comment
exports.addComment = (req, res) => {
    const {
        blog_id,
        user_id,
        user_name,
        comment_content,
        create_time,

        parent_id,
        target_name
    } = req.body
    const comment = new Comment({
        blog_id,
        user_id,
        user_name,
        comment_content,
        create_time,

        parent_id,
        target_name
    })
    comment.save()
        .then(comment => {
            Blog.findById({ _id: blog_id }, (err, blog) => {
                if (err) {
                    console.error('Error:' + err);
                }
                //add comment to the blog and increase the number of comment
                blog.blog_comments.push(comment._id)
                blog.meta.comments = blog.meta.comments + 1

                Blog.updateOne({ _id: blog_id }, { blog_comments: blog.blog_comments, meta: blog.meta }, (err, result) => {
                    if (err) {
                        console.error('Error:' + err);
                    }
                    responseClient(res, 200, 0, 'Add comment successfully', comment)
                })
            })

        })
        .catch(err => {
            console.error(err)
            responseClient(err)
        })
}

//Retrieving all comments
exports.getAllComments = (req, res) => {
    const {
        blog_id
    } = req.params
    let search_conditions = {};
    search_conditions.blog_id = blog_id
    let responseData = {
        total: 0,
        list: [],
    }

    Comment.countDocuments(search_conditions, (err, count) => {
        if (err) {
            console.error(err)
        } else {
            responseData.total = count;
            let options = {
                sort: { create_time: 1 },
            }
            Comment.find(search_conditions, 'comment_id blog_id user_id user_name comment_content create_time parent_id target_name', options, (err, docs) => {
                if (err) {
                    console.error(err);
                    responseClient(res)
                } else {
                    responseData.list = docs
                    responseClient(res, 200, 0, 'Get all comments successfully', responseData)
                }
            })
        }

    })
}

//Delete a comment

exports.deleteComment = (req, res) => {
    const {
        comment_id,
    } = req.params
    const conditions = {
        _id: comment_id,
        comment_content: comment_content
    }
    if (!comment_id) {
        responseClient(res, 500, 1, 'Comment not found!');
        return;
    } else {
        Comment.findOneAndDelete(conditions, (err, doc) => {
            if (err) {
                console.error(err);
                responseClient(res)
            } else {
                responseClient(res, 200, 1, 'Delete comment successfully', doc)
            }
        })
    }
}