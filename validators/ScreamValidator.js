const Joi = require("joi");
Joi.objectId = require('joi-objectid')(Joi);

const validateScreams = data => {
    const schema = Joi.object({
        userHandle: Joi.string().required(),
        body: Joi.string().required(),
        userImage: Joi.string(),
        likeCount: Joi.number(),
        commentCount: Joi.number(),
    });
    return schema.validate(data);
}

module.exports = { validateScreams }