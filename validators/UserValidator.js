const Joi = require("joi");

const loginValidator = data => {
    const schema = Joi.object({
        email: Joi.string().required(),
        password: Joi.string().required(),
    });
    return schema.validate(data);
}

const registerValidator = data => {
    const schema = Joi.object({
        handle: Joi.string().required(),
        email: Joi.string().required(),
        password: Joi.string().required(),
        confirmPassword: Joi.string().required()
    });
    return schema.validate(data);
}

const userLikeValidator = data => {
    const schema = Joi.object({
        screamId: Joi.number().required(),
        userHandle: Joi.string().required(),
    });
    return schema.validate(data);
}

const userDetailsValidator = data => {
    const schema = Joi.object({
        website: Joi.string().required(),
        bio: Joi.string().required(),
        location: Joi.string().required()
    });
    return schema.validate(data);
}
const notificationValidator = data => {
    const schema = Joi.object({
        recipient: Joi.string().required(),
        sender: Joi.string().required(),
    });
    return schema.validate(data);
}

module.exports = {
    loginValidator,
    registerValidator,
    userLikeValidator,
    notificationValidator,
    userDetailsValidator
}
