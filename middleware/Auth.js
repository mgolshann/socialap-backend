const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = function(req, res, next) {
    const token = req.header("x-auth-token");
    if (!token) return res.status(401).send("Yod don't have permission to this operation.");

    try {
        req.user = jwt.verify(token, config.get("jwtPrivateKey"));
        next();
    } catch(ex) {
        return req.status(401).send("You don't have permission to this operation.");
    }
     
}