const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const multer = require("multer");
const _ = require("lodash");
const UserModel = require("../models/UserModel")
const LikeModel = require("../models/LikeModel")
const NotificationModel = require("../models/NotificationModel")
const config = require("config");
const Auth = require("../middleware/Auth");
const {
    loginValidator,
    registerValidator,
    userLikeValidator,
    notificationValidator,
    userDetailsValidator
} = require("../validators/UserValidator")

const path = require('path');

router.get("/api/getUserData", Auth, async (req, res) => {

    const mongoose = require('mongoose');
    if (!mongoose.isValidObjectId(req.user._id)) return res.status(400).send('bad Id');

    let userData = {};
    let result = await UserModel.findById(req.user._id).select({ password: 0, __v: 0 });
    if (result) {
        userData.credentials = result;
        result = await LikeModel.find({ userHandle: req.user.handle }).select({ __v: 0 });
        if (result) userData.likes = result;

        result = await NotificationModel.find({ recipient: req.user.handle }).select({ __v: 0 });
        if (result) userData.notifications = result;

        return res.send(userData);
    }

    res.status(404).send('not found');
})

router.post("/api/signup", async (req, res) => {
    const { error } = registerValidator(req.body);
    if (error) return res.status(400).send({ message: error.message })

    let user = await UserModel.findOne({ email: req.body.email });
    if (user) return res.status(400).send({ message: 'this user have been already registered!!' })

    const userImage = 'no-image.jpg';
    req.body = { ...req.body, userImage };

    user = new UserModel(_.pick(req.body, ["handle", "email", "password", "userImage"]));
    user = await user.save();

    const data = {
        _id: user._id,
        handle: user.handle,
        email: user.email,
        password: user.password,
        userImage,
    }

    const token = jwt.sign(data, config.get("jwtPrivateKey"));
    res.header('x-auth-token', token).send(_.pick(user, ["_id", "handle", "email", "userImage", "createdAt"]));

});

router.post("/api/login", async (req, res) => {

    const { error } = loginValidator(req.body);
    if (error) res.status(400).send({ message: error.message });

    let user = await UserModel.findOne({ email: req.body.email });
    if (!user) return res.status(400).send({ message: "user not found!!" });

    if (req.body.password !== user.password) return res.status(400).send({ message: "user not found!!!" });

    const data = {
        _id: user._id,
        email: user.email,
        handle: user.handle,
    }

    const token = jwt.sign(data, config.get("jwtPrivateKey"));
    res.header('x-auth-token', token).status(200).send({ success: true })
});

router.post("/api/createLike", Auth, async (req, res) => {

    const mongoose = require('mongoose');
    if (!mongoose.isValidObjectId(req.user._id)) return res.status(400).send('bad Id');

    const { error } = userLikeValidator(req.body);
    if (error) res.status(400).send({ message: error.message })


    let userLike = new LikeModel(_.pick(req.body, ["userHandle", "screamId"]));
    userLike = await userLike.save();

    res.status(201).send(_.pick(userLike, ["userHandle", "screamId"]));
});

router.post("/api/createNotification", Auth, async (req, res) => {

    const mongoose = require('mongoose');
    if (!mongoose.isValidObjectId(req.user._id)) return res.status(400).send('bad Id');

    const { error } = notificationValidator(req.body);
    if (error) res.status(400).send({ message: error.message })

    let notification = new NotificationModel(_.pick(req.body, ["recipient", "sender"]));
    notification = await notification.save();

    res.status(201).send(_.pick(notification, ["recipient", "sender"]));
});


router.post("/api/editUserDetails", Auth, async (req, res) => {

    const mongoose = require('mongoose');
    if (!mongoose.isValidObjectId(req.user._id)) return res.status(400).send('bad Id');
    
    const { error } = userDetailsValidator(req.body);
    if (error) res.status(400).send({ message: error.message })

    let user = await UserModel.findById(req.user._id);
    if (!user) return res.status(404).send({ message: 'user not found!' });
    
    user.bio = req.body.bio;
    user.website = req.body.website;
    user.location = req.body.location;

    user = await user.save();
    res.send(user);
});







var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/images')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
})
var upload = multer({
    storage: storage,
    limits: { fileSize: 1000000 },
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb)
    }
})
function checkFileType(file, cb) {
    // Allowed ext
    const filetypes = /jpeg|jpg|png|gif/;
    // Check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Images Only!');
    }
}

router.post("/api/uploadImage", [Auth, upload.single("image")], async (req, res) => {
    const mongoose = require('mongoose');
    if (!mongoose.isValidObjectId(req.user._id)) return res.status(400).send('bad Id');

    let user = await UserModel.findById(req.user._id);
    if (!user) return res.status(404).send({ message: 'user not found!' });

    user.userImage = `http://localhost:3000/images/` + req.file.filename;
    user = await user.save();
    res.send(user);
})


module.exports = router;
