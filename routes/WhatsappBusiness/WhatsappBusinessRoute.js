const express = require("express");
const router = express.Router();

const { sendTextMessage, sendTemplateMessage, sendLocationRequestMessage } = require("../../helpers/WhatsappBusiness/MessageHelper");
const { WhatsappOnboardGetValidation } = require("../../middleware/Whatsapp/Onboard.Validation");
const { getWhatsappOnboard } = require("../../controllers/OnboardController");

router.post("/sendWhatsappTemplate",sendTemplateMessage);
router.post("/sendTextMessage", sendTextMessage);
router.post("/getWhatsappOnboard", WhatsappOnboardGetValidation, getWhatsappOnboard)
router.post("/sendLocationRequestMessage",sendLocationRequestMessage)

module.exports = router;


