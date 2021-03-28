const express = require("express");
const Auth = require("../middleware/Auth");
const LikeModel = require("../models/LikeModel");
const ScreamsModel = require("../models/ScreamsModel");
const { validateScreams } = require("../validators/ScreamValidator");
const { userLikeValidator } = require("../validators/UserValidator");
const router = express.Router();
const _ = require("lodash");


router.get("/api/screams", async (req, res) => {
    const screams = await ScreamsModel.find();
    res.send(screams);
});

router.post("/api/screams", async function (req, res) {

    const { error } = validateScreams(req.body);
    if (error) return res.status(400).send({ message: error.message });

    let screams = new ScreamsModel({
        userHandle: req.body.userHandle,
        body: req.body.body,
        userImage: "http://localhost:3000/images/1.jpg",
        createdAt: new Date().toISOString(),
        likeCount: 0,
        commentCount: 0
    });
    const result = await screams.save();
    res.status(200).send(result);
});

router.get('/api/scream/:screamId/like', Auth, async (req, res) => {
    const mongoose = require('mongoose');
    if (!mongoose.isValidObjectId(req.user._id)) return res.status(400).send('bad Id');

    const scream = ScreamsModel.findById(req.params.screamId);
    if (!scream) return res.send("not found scream!");

    scream.likeCount = scream.likeCount + 1;
    await scream.save();

    const data = {
        userHandle: req.user.handle,
        screamId: req.params.screamId
    }

    ScreamsModel
    let userLike = new LikeModel(data);
    userLike = await userLike.save();

    res.status(201).send(data);
})

router.get('/api/scream/:screamId/unLike', Auth, async (req, res) => {
    const mongoose = require('mongoose');
    if (!mongoose.isValidObjectId(req.user._id)) return res.status(400).send('bad Id');


    const data = {
        userHandle: req.user.handle,
        screamId: req.params.screamId
    }
    //return console.log(data);

    await LikeModel.findOneAndDelete(data);
    res.status(200).send(req.params.screamId);
})


module.exports = router;

