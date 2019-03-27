const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment')
const crypto = require('crypto') 

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    type: { type: Number, default: 0 },//0:user, 1:admin
    password: { type: String, required: true },
    email: { type: String, required: true },
    hash: String,
    salt: String,
    create_time: { type: Date, default: Date.now }
})

userSchema.methods.setPassword = function (password) {
    // creating a unique salt for a particular user 
    this.salt = crypto.randomBytes(16).toString('hex');
    // hashing user's salt and password with 1000 iterations, 64 length and sha512 digest 
    this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, `sha512`).toString(`hex`);
};
userSchema.methods.validPassword = function (password) {
    const hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, `sha512`).toString(`hex`);
    return this.hash === hash;
};

module.exports = mongoose.model('User', userSchema)