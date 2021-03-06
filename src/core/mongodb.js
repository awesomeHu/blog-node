
const mongoose = require('mongoose');
const CONFIG = require('../app.config.js')
const autoIncrement = require('mongoose-auto-increment');


exports.mongoose = mongoose

//connect
exports.connect = () => {

    var dbURI = 'mongodb://127.0.0.1:27017/blog_node';
    if (process.env.NODE_ENV === 'production') {
        dbURI = process.env.MONGODB_URI  
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