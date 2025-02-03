const joi = require("@hapi/joi");

const schema = {
    GetWhatsappOnboard: joi.object({
        domain_name: joi.string().required(),
        user_id: joi.number().required(),
    }),
    WhatsappAddCandidate: joi.object({
        domain_name: joi.string().required(),
        user_id: joi.number().required(),
        user_data: joi.string().required(),

    }),
}

module.exports = schema;


