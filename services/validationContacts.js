const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

const schemaContact = Joi.object({
    name: Joi.string()
        .min(3)
        .max(30)
        .required(),
    email: Joi.string()
        .email()
        .required(),
    phone: Joi.string()
        .pattern(/\(\d{3}\)\s\d{3}-\d{4}/)
        .required(),
    favorite: Joi.boolean().optional(),
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
        .pattern(/\(\d{3}\)\s\d{3}-\d{4}/)
        .optional(),
    favorite: Joi.boolean().optional(),
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
        .pattern(/\(\d{3}\)\s\d{3}-\d{4}/)
        .optional(),
    favorite: Joi.boolean().optional(),
});

const schemaStatusContact = Joi.object({
    favorite: Joi.boolean().required(),
});

//const schemaId = Joi.object({
    //contactId: Joi.objectId().required(),
//});

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
    }
};

module.exports.schemaContact = (req, _res, next) => {
    return validate(schemaContact, req.body, next);
};

module.exports.schemaUpdateContact = (req, _res, next) => {
    return validate(schemaUpdateContact, req.body, next);
};

module.exports.schemaPutContact = (req, _res, next) => {
    return validate(schemaPutContact, req.body, next);
};

module.exports.schemaStatusContact = (req, _res, next) => {
    return validate(schemaStatusContact, req.body, next);
};

//module.exports.schemaId = (req, _res, next) => {
    //return validate(schemaId, req.body, next);
//};
