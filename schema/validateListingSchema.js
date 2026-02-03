const Joi = require("joi");

module.exports.listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        image: Joi.object({
            url: Joi.string().uri().allow("").optional(),
            alt: Joi.optional()
        }),
        price: Joi.number().min(0).required(),
        location: Joi.string().required(),
        country: Joi.string().required(),
        category: Joi.string()
            .valid(
                "mountains",
                "beachside",
                "lakeside",
                "city",
                "downtown",
                "adventure",
                "luxury",
                "budget",
                "unique",
                "romantic"
            )
            .required()
            .messages({
                "any.only": "Please select a valid listing category.",
                "any.required": "Listing category is required."
            }),
    }).required(),
});