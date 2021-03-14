const Joi = require("joi")

const validateCreateCustomer = data => {
    const schema = Joi.object({
        name: Joi.string().min(2).max(10).required(),
    });
    return schema.validate(data);
}

module.exports = { validateCreateCustomer }