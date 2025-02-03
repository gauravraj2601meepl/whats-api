require("dotenv").config();
const { Sequelize } = require("sequelize");
const { WhatsappOnboardAddValidation } = require("../middleware/Whatsapp/Onboard.Validation");

const sequelize = new Sequelize(process.env.CONNECTION_STRING, {
    dialect: "postgres",
    port: process.env.DB_PORT,
});

// get Onboard
const getWhatsappOnboard = async (req, res) => {
    console.log("working")
    try {
        var result = await sequelize
            .query("select * from public.fn_get_whatsapp_onboard(:domain_name,:user_id);", {
                replacements: {
                    domain_name: req.body.domain_name,
                    user_id: req.body.user_id,
                   
                },
                type: sequelize.QueryTypes.SELECT,
            })
            .then(function (response) {
                return res.status(200).json({
                    statuscode: 200,
                    status: "success",
                    data: response,
                    error: [{ message: "", errorcode: "" }],
                });
            });
    } catch (err) {
        res.status(500).json({
            statuscode: 500,
            status: "failed",
            data: {},
            error: [{ message: err.message, errorcode: 500 }],
        });
    }
};
// add Onboard
const addWhatsappOnboard = async (req, res) => {
    try {
        var response = await sequelize
            .query("select * from public.fn_whatsapp_addonboard(:domain_name,:user_id,:employee_data);", {
                replacements: {
                    domain_name: req.body.domain_name,
                    user_id: req.body.user_id,
                    employee_data: req.body.employee_data,
                },
                type: sequelize.QueryTypes.SELECT,
            })
            console.log("response", response);
            return {
                statuscode: 200,
                status: "success",
                data: response,
                error: [{ message: "", errorcode: "" }],
            };
    } catch (err) {
        return {
            statuscode: 500,
            status: "failed",
            data: {},
            error: [{ message: err.message, errorcode: 500 }],
        }
    }
};

const OnboardWhatsappCanidate = async (data) => {
    try {
        const validationResult = await WhatsappOnboardAddValidation({ body: data }, null, () => {});
        if (validationResult) {
            return { success: false, message: "Validation failed" };
        }

        const saveResult = await addWhatsappOnboard({body: data}, null);
        console.log("saveREsult", saveResult)
        if (saveResult?.status === "success") {
            console.log("res_addWhatsappOnboard", saveResult)
            return saveResult;
        }
        else{
            console.log("err_addWhatsappOnboard", saveResult)
            return saveResult;
        }

    } catch (error) {
        console.error("Error during candidate onboarding:", error);
        return { success: false, message: error.message };
    }
};



module.exports = {
    getWhatsappOnboard,
    addWhatsappOnboard,
    OnboardWhatsappCanidate
}