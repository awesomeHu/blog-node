const responseClient = require('../util/util').responseClient;
const User = require('../models/user.js')
const jwt = require('jsonwebtoken')

exports.login = (req, res) => {
    const {
        email,
        password,
    } = req.body;
    if (!email) {
        return responseClient(res, 400, 1, 'The email is Reqiured!')
    }
    if (!password) {
        return responseClient(res, 400, 1, 'The password is required!')
    }
    User.findOne({ email: email }, (err, user) => {
        if (user === null) {
            responseClient(res, 400, 1, 'User not found')
            return;
        }
        else {
            if (user.validPassword(password)) {
                const resData = {}
                if (email === 'hwkgoook@gmail.com') {
                    const token = jwt.sign(
                        { email, userId: user._id, role: 'admin' },
                        'ItIsASecret',
                        {
                            expiresIn: "3h"
                        })
                    resData.token = token
                    resData.type = 1
                    resData.userId = user._id
                    resData.name= user.name
                } else {
                    const token = jwt.sign(
                        { email, userId: user._id, role: 'user' },
                        'ItIsASecret',
                        {
                            expiresIn: "1h"
                        })
                    resData.token = token
                    resData.type = 0
                    resData.userId = user._id
                    resData.name= user.name
                }
                return responseClient(res, 200, 0, 'Logged in successfully', resData)
            } else responseClient(res, 400, 1, 'The password is incorrect')
        }
    })
}


exports.signup = (req, res) => {
    const {
        name, email, password, password_confirm
    } = req.body
    const reg = new RegExp('^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$')

    if (!email || !reg.test(email)) {
        return responseClient(res, 400, 2, 'The correct email is reqiured!')
    }
    if (!password || !password_confirm) {
        return responseClient(res, 400, 2, 'The password is required!')
    }
    if (password !== password_confirm) {
        return responseClient(res, 400, 2, 'Double Check your password!')
    }
    const user = new User({
        name, email, password
    })

    //call setPassword to hash password
    user.setPassword(password)
    User.findOne({ email: email }, (err, result) => {
        if (result) {
            return responseClient(res, 200, 1, 'User already exists!')
        } else {
            user.save()
                .then(doc => {
                    const data = {};
                    if (doc) {
                        data.name = doc.name
                        // data.password = user.password
                        data.email = doc.email
                        data._id = doc._id
                    }
                    responseClient(res, 200, 0, 'Register successfully', data)
                })
                .catch(err => {
                    console.error('Error', err)
                    return responseClient(res, 400, 1, 'Failed to register')
                })
        }
    })

}


exports.getAllUsers = (req, res) => {
    let options = {
        sort: {
            create_time: -1
        }
    }
    User.find({}, 'name password email create_time', options, (err, result) => {
        if (err) {
            console.error("Error", err)
            return responseClient(res, 200, 1, 'Cannot retrieve users!')
        }
        responseClient(res, 200, 0, 'Retrieve users succeded!', result)
    })
}