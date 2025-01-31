const express = require("express");
const { webhookConfiguration, webhookHandler } = require("../../controllers/WhatsappBusiness/WebhookController");
const router = express.Router();

router.get("/webhook",webhookConfiguration)
router.post("/webhook", webhookHandler)

module.exports = router;


/*
commands encryption formate:

let text = "/meepl onboarding @santosh_adobemeepl"
 const regex = /^\/meepl onboarding/;
const command = text?.match(regex)?.[0];

const encVal = text?.replace(command, "")?.trim();
console.log("command:", command)
console.log("encVal:",encVal)

let buttonId = `start_onboarding_${encVal}`.split("_")
console.log("buttonId:", buttonId)
let start_cmd = buttonId.slice(0, 2).join("_")  
console.log("start_cmd:", start_cmd)
let encInfo= buttonId.slice(2)
console.log("share_id:", encInfo.join("_"))
console.log("workspace:", encInfo?.[1])

*/