const responseClient = require('../util/util').responseClient
const Blog = require('../models/blog.js')
const User = require('../models/user.js')

//create and save a new blog
exports.addBlog = (req, res) => {
    //validate a request
    const {
        blog_title,
        blog_content,
        category,
        author,
    } = req.body;
    console.log('req.body', req.body.blog_content)
    if (!blog_content) {
        responseClient(res, 500, 1, 'Blog content can not be found')
        return;
    }

    const blog = new Blog({
        blog_title,
        blog_content,
        category,
        author,
    })

    //save blog in the database

    blog.save()
        .then(data => {

            responseClient(res, 200, 0, 'Save successfully', data)
        })
        .catch(err => {
            console.log('Error', err)
            responseClient(res)
        })
}


//Retrieving all blogs

exports.findAllBlogs = (req, res) => {
    let category_id = req.query.category_id || '';
    let search_conditions = {};
    if (category_id) search_conditions.category = category_id;
    let responseData = {
        total: 0,
        list: []
    }
    let options = {
        sort: { create_time: -1 }
    }
    Blog.countDocuments(search_conditions)
        .then(count => {
            responseData.total = count
            Blog.find(search_conditions, 'blog_title author blog_content blog_comments category like_users meta create_time update_time', options)
                .then((results) => {
                    responseData.list = results;
                    responseClient(res, 200, 0, 'Retrieving blogs successfully', responseData)
                }).catch(err => console.error('Error:' + err))
        }).catch(error => {
            console.error('Error:' + error);
            responseClient(res)
        })
}

// Retrieving a single blog detail

exports.findOneBlog = (req, res) => {

    const { blog_id } = req.params;
    if (!blog_id) {
        responseClient(res, 200, 1, 'Blog not found!');
        return;
    }
    else {
        Blog.findById({ _id: blog_id }, (err, result) => {
            if (err || !result) {
                console.error(err)
                responseClient(res)
                return
            }
            result.meta.views = result.meta.views + 1;
            Blog.updateOne({ _id: blog_id }, { meta: result.meta })
                .then(blog => {
                    responseClient(res, 200, 0, 'Blog is found!', result);
                })
                .catch(err => {
                    console.error(err)
                    throw err;
                });
        })
            .populate({ path: 'blog_comments category' }).exec((err, docs) => { console.log(err) })

    }
}

//Updating a blog

exports.updateBlog = (req, res) => {

    const { blog_id } = req.params
    const {
        blog_title,
        blog_content,
        category
    } = req.body
    Blog.updateOne({ _id: blog_id }, { blog_title, blog_content, category }, { new: true })
        .then(blog => {
            responseClient(res, 200, 0, 'Update blog successfully', blog);
        }).catch(err => {
            console.error(err)
            responseClient(res)
        });
}

//Deleting a blog

exports.deleteBlog = (req, res) => {
    const {
        blog_id,
    } = req.params;

    Blog.remove({
        _id: blog_id
    })
        .then(result => {
            responseClient(res, 200, 0, "Blog deleted successfully!", result);
        }).catch(err => {
            console.error(err);
            responseClient(res)
        })
}

exports.likeBlog = (req, res) => {

    const {
        user_id,
        blog_id
    } = req.body;
    // Firstly find the blog which was liked, and update the like_users info(by looking up the User database) and likes property of that blog
    Blog.findById({ _id: blog_id })
        .then(blog => {
            if (blog) {
                let fields = {};
                blog.meta.likes = blog.meta.likes + 1;
                fields.meta = blog.meta;
                let all_users_to_like = blog.like_users.length > 0 ? blog.like_users : []
                let new_user_to_like = {};
                User.findOne({_id: user_id})
                    .then(user => {
                        new_user_to_like.email = user.email
                        new_user_to_like.user_id = user.user_id;
                        new_user_to_like.user_name = user.user_name;
                        new_user_to_like.create_time = user.create_time
                        all_users_to_like.push(new_user_to_like)
                        fields.like_users = all_users_to_like
                        Blog.updateOne({ _id: blog_id }, fields)
                            .then(result => {
                                responseClient(res, 200, 0, 'Like successfully', blog)
                            })
                            .catch(err => {
                                console.error('err :', err);
                                throw err;
                            })
                    })
                    .catch(err => {
                        responseClient(res);
                        console.error('err 1:', err);

                    })
            }
        })
        .catch(err => {
            responseClient(res);
            console.error('err 2:', err)
        })
}