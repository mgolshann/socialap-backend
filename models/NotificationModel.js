const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    recipient: { type: String, required: true },
    sender: { type: String, required: true },
    createdAt: { type: Date, default: new Date().toISOString() }
});

const NotificationModel = mongoose.model('Notification', schema);

module.exports = NotificationModel;
