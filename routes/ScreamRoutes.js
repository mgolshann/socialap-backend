const express = require("express");
const ScreamsModel = require("../models/ScreamsModel");
const { validateScreams } = require("../validators/ScreamValidator.js");
const router = express.Router();

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


module.exports = router;

