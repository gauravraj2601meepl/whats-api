const express = require("express");
const router = express.Router();

const { sendTextMessage, sendTemplateMessage } = require("../../helpers/WhatsappBusiness/MessageHelper");
const { WhatsappOnboardGetValidation } = require("../../middleware/Whatsapp/Onboard.Validation");
const { getWhatsappOnboard } = require("../../controllers/OnboardController");

router.post("/sendWhatsappTemplate",sendTemplateMessage);
router.post("/sendTextMessage", sendTextMessage);
router.post("/getWhatsappOnboard", WhatsappOnboardGetValidation, getWhatsappOnboard)


module.exports = router;


