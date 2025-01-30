const express = require("express");
const router = express.Router();

const { AuthenticateHrmsBearerTokenUtility } = require("../../middleware/Auth/Auth.Validation");

const { sendTextMessage, sendTemplateMessage } = require("../../helpers/WhatsappBusiness/MessageHelper");

router.post("/sendWhatsappTemplate", AuthenticateHrmsBearerTokenUtility, sendTemplateMessage);
router.post("/sendTextMessage", AuthenticateHrmsBearerTokenUtility, sendTextMessage);




module.exports = router;


