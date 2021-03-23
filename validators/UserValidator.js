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

module.exports = { loginValidator, registerValidator }
