const express = require("express");
const { webhookConfiguration, webhookHandler } = require("../../controllers/WhatsappBusiness/WebhookController");
const router = express.Router();

// router.get("/webhook",webhookConfiguration)
router.post("/webhook", webhookHandler)
router.get("/webhook", (req, res) => {
  const VERIFY_TOKEN = process.env.WEBHOOK_CONFIG_TOKEN;
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token === VERIFY_TOKEN) {
    console.log("Webhook Verified");
    return res.status(200).send(challenge);
  }

  res.sendStatus(403);
});

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
console.log("used_id:", encInfo?.[0])



////////////////


let data = {
    step: 3,
    share_id: "@gaurav_adobemeepl",
    workspace: "adobemeepl",
    
    user_id: "228"
    firstName: "third",
    lastName: "user",
    gender: "Male",
    mobile: "1236547890",
    email: "third@gmail.com",
    birthDate: "2025-12-12",
}

 let {step, ...filteredUserData} = data;
 const newCandidate ={
     domain_name: "adobemeep",
     employee_data: JSON.stringify([filteredUserData]),
     user_id: '228'
 }

*/