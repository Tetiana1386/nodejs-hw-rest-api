const Joi = require('joi');

const schemaCreateContact = Joi.object({
    name: Joi.string()
        .min(3)
        .max(30)
        .required(),
    email: Joi.string()
        .email()
        .required(),
    phone: Joi.string()
        .pattern(/^[(][\d]{3}[)]\s[\d]{3}[-][\d]{4}/)
        .required(),
});

const schemaUpdateContact = Joi.object({
    name: Joi.string()
        .min(3)
        .max(30)
        .optional(),
    email: Joi.string()
        .email()
        .optional(),
    phone: Joi.string()
        .pattern(/^[(][\d]{3}[)]\s[\d]{3}[-][\d]{4}/)
        .optional(),
}).min(1);
