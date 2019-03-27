
const mongoose = require('mongoose');
const CONFIG = require('../app.config.js')
const autoIncrement = require('mongoose-auto-increment');


exports.mongoose = mongoose

//connect
exports.connect = () => {

    //connect database
    mongoose.connect(CONFIG.MONGODB.uri, {
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