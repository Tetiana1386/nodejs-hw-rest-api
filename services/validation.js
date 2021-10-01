const Joi = require('joi');

const schemaAddContact = Joi.object({
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

const schemaPutContact = Joi.object({
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
});

const validate = async (schema, obj, res, next) => {
    try {
        await schema.validateAsync(obj);
        next();
    } catch (err) {
        res.status(400).json({
            status: 'error',
            code: 400,
            message: `Field ${err.message.replace(/"/g, '')}`,
        });
    };
};

module.exports.addContact = (req, _res, next) => {
    return validate(schemaAddContact, req.body, next);
};

module.exports.updateContact = (req, _res, next) => {
    return validate(schemaUpdateContact, req.body, next);
};

module.exports.putContact = (req, _res, next) => {
    return validate(schemaPutContact, req.body, next);
};


