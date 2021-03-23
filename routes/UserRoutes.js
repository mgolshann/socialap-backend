const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const _ = require("lodash");
const { loginValidator, registerValidator } = require("../validators/UserValidator")
const UserModel = require("../models/UserModel")
const config = require("config");


router.post("/api/signup", async (req, res) => {
    const { error } = registerValidator(req.body);
    if (error) res.status(400).send({ message: error.message })

    let user = await UserModel.findOne({ email: req.body.email });
    if (user) res.status(400).send({ message: 'this user have been already registered!!' })

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
    res.header('x-auth-token', token).send(_.pick(user, ["_id", "handle", "email", "userImage"]));

    res.status(201).send(user);
});

router.post("/api/login", async (req, res) => {

    const { error } = loginValidator(req.body);
    if (error) res.status(400).send({ message: error.message });

    let user = await UserModel.findOne({ email: req.body.email });
    if (!user) return res.status(400).send({ message: "user not found!!" });

    if (req.body.password !== user.password) return res.status(400).send({ message: "user not found!!!" });

    const data = {
        _id: user._id,
        email: user.email
    }

    const token = jwt.sign(data, config.get("jwtPrivateKey"));
    res.header('x-auth-token', token).status(200).send({ success: true })
});


module.exports = router;
