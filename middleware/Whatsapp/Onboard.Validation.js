const { GetWhatsappOnboard, WhatsappAddCandidate } = require("../../models/Candidate");


module.exports = {
    WhatsappOnboardGetValidation: async (req, res, next) => {
        const value = await GetWhatsappOnboard.validate(req.body);
        if (value.error) {
            res.status(400).json({
                statuscode: 400,
                status: "validation-error",
                data: {},
                error: [{ message: value.error.details[0].message, errorcode: 400 }],
            });
        } else {
            next();
        }
    },
    WhatsappOnboardAddValidation: async (req, res, next) => {
        const value = await WhatsappAddCandidate.validate(req.body);
        console.log('value', value)
        if (value?.error) {
            console.log("validation-error",{ message: value.error.details[0].message, errorcode: 400 })
            res?.status(400).json({
                statuscode: 400,
                status: "validation-error",
                data: {},
                error: [{ message: value.error.details[0].message, errorcode: 400 }],
            });
        } else {
            next();
        }
    },
    
    
    
};