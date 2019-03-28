
const mongoose = require('mongoose');
const CONFIG = require('../app.config.js')
const autoIncrement = require('mongoose-auto-increment');


exports.mongoose = mongoose

//connect
exports.connect = () => {

    let dbURI = 'mongodb://127.0.0.1:27017/blog_node';
    if (process.env.NODE_ENV === 'production') {
        dbURI = 'mongodb://heroku_r51dtnk0:3gchv8be1id51c2lfpiba122mp@ds121105.mlab.com:21105/heroku_r51dtnk0';
    }

    //connect database
    mongoose.connect(dbURI, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        autoIndex: false, // Don't build indexes
        promiseLibrary: global.Promise
    })
        //connect successfully
        .then(() => {
            console.log("Successfully connected to the database");
            return;
        })
        //connection failed
        .catch(err => {
            console.log('Could not connect to the database. Exiting now...', err);
            process.exit();
        })

    return mongoose;

}