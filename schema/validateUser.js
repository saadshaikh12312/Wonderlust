const Joi = require("joi");

module.exports.userSchema = Joi.object({
    username: Joi.string().min(3).required(),
    email: Joi.string().email({ tlds: { allow: false } }).required(),
    password: Joi.string().min(6).required(),
    name: Joi.object({
        firstname: Joi.string().min(1).required(),
        lastname: Joi.string().min(1).required(),
    }).required(),
});