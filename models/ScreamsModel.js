const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    userHandle: { type: String, required: true },
    body: { type: String, required: true },
    userImage: { type: String, required: true },
    likeCount: { type: Number, required: true },
    commentCount: { type: Number, required: true },
    createdAt: { type: Date, default: new Date().toISOString() },
});

const ScreamsModel = mongoose.model('screams', schema);

module.exports = ScreamsModel;