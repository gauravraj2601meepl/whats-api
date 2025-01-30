const express = require("express");
const router = express.Router();

const { sendTextMessage, sendTemplateMessage } = require("../../helpers/WhatsappBusiness/MessageHelper");

router.post("/sendWhatsappTemplate",sendTemplateMessage);
router.post("/sendTextMessage", sendTextMessage);




module.exports = router;


