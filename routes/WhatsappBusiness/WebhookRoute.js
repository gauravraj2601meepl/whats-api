const express = require("express");
const { AuthenticateHrmsBearerTokenUtility } = require("../../middleware/Auth/Auth.Validation");
const { webhookConfiguration, webhookHandler } = require("../../controllers/WhatsappBusiness/WebhookController");
const router = express.Router();

router.post("/webhook",AuthenticateHrmsBearerTokenUtility,webhookConfiguration)
router.post("/webhook", AuthenticateHrmsBearerTokenUtility, webhookHandler)

