const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    handle: { type: String, required: true },
    email: { type: String, unique: true },
    password: { type: String, required: true },
    userImage: { type: String, required: true}
});

const UserModel = mongoose.model('User', schema);

module.exports = UserModel;