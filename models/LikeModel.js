const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    screamId: { type: mongoose.Schema.Types.ObjectId, required: true },
    userHandle: { type: String, required: true },
});

const LikeModel = mongoose.model('Like', schema);

module.exports = LikeModel;