module.exports = (app) => {
    const authorize = require('../middleware/check_auth')
    const blogs = require('../controller/blog_controller.js');
    const categories = require('../controller/category_controller.js')
    const comments = require('../controller/comment_controller.js')
    const user = require('../controller/user_controller.js')

    //Blog
    app.route('/blogs')
        // Retrieve all blogs
        .get(blogs.findAllBlogs)
        // Create a new blog
        .post(authorize('admin'), blogs.addBlog)

    app.route('/blogs/:blog_id')
        // Retrieve a single blog with blog_id
        .get(blogs.findOneBlog)
        // Update a blog with blog_id
        .put(authorize('admin'), blogs.updateBlog)
        // Delete a blog with blog_id
        .delete(authorize('admin'), blogs.deleteBlog)

    app.route('/likeBlog')
        //Like blog
        .post(authorize(), blogs.likeBlog)


    //categories
    app.route('/categories')
        .get(categories.getAllCategories)
        .post(authorize('admin'), categories.addCategory)

    app.route('/categories/:category_id')
        .delete(authorize('admin'), categories.deleteCategory)


    //comment
    app.route('/comments/:blog_id')
        .get(comments.getAllComments)
        .post(authorize(), comments.addComment);

    app.route('/comments/:comment_id')
        .delete(authorize('admin'), comments.deleteComment);


    //login
    app.route('/login')
        .post(user.login)

    //sign up
    app.route('/signup')
        .post(user.signup)

    app.route('/users')
        .get(authorize('admin'), user.getAllUsers)

}