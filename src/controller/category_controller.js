const responseClient = require('../util/util').responseClient;
const Category = require('../models/category.js')

//Add new category
exports.addCategory = (req, res) => {
    const {
        name,
    } = req.body
    if (!name) {
        responseClient(res, 200, 1, 'No category to be added!')
        return
    }
    Category.findOne({ name }).then(category => {
        if (!category) {
            const category = new Category({
                name,
            })
            category.save()
                .then(category => {
                    responseClient(res, 200, 0, 'Create category successfully', category)
                })
                .catch(err => {
                    throw err;
                })
        } else responseClient(res, 200, 1, 'This category already exists')
    }).catch(err => {
        console.error(err)
        responseClient(res)
    })

}
// Getting all categories
exports.getAllCategories = (req, res) => {
    const responseData = {
        total: 0,
        list: []
    }
    Category.countDocuments((err, count) => {
        // if (err) console.error('Error', err)
        if (!count) {
            responseClient(res, 200, 1)
            return
        }
        responseData.total = count;
        Category.find((err, result) => {
            if (err) console.error('Error', err)
            responseData.list = result
            responseClient(res, 200, 0, 'Get all categories', responseData)
        })
    })
}

//Detele a category

exports.deleteCategory = (req, res) => {
    const {
        category_id,
    } = req.params
    Category.deleteMany({
        _id: category_id
    })
        .then(result => {
            if (result.n === 1) {
                responseClient(res, 200, 0, 'Delete successfully!', result)
            } else responseClient(res, 500, 1, 'Category cannot be found')
        })
        .catch(err => {
            console.error('err', err)
            responseClient(res)
        })

}