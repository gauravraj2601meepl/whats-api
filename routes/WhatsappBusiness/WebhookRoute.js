const express = require("express");
const { webhookConfiguration, webhookHandler } = require("../../controllers/WhatsappBusiness/WebhookController");
const router = express.Router();

router.get("/webhook",webhookConfiguration)
router.post("/webhook", webhookHandler)

module.exports = router;


