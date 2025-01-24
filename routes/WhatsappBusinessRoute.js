const express = require("express");
const router = express.Router();


const { sendTemplateMessage, sendTextMessage } = require("../controller/WhatsappTestController");
const { appendFile } = require("fs");
router.post("/sendWhatsappTemplate", sendTemplateMessage);
router.post("/sendTextMessage", sendTextMessage);

router.get("/webhook", (req,res)=>{

    const VERIFY_TOKEN = "meepl";
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    if (mode && token === VERIFY_TOKEN) {
        console.log("Webhook Verified");
        return res.status(200).send(challenge);
    }

    res.sendStatus(403);
})

router.post("/webhook", async (req, res) => {
    const body = req.body;

    if (body.object === "whatsapp_business_account") {
        body.entry.forEach(async (entry) => {
            console.log("entry", entry)
            entry.changes.forEach(async (change) => {
                const messageData = change.value.messages;

                if (messageData && messageData.length > 0) {
                    const message = messageData[0];
                    const from = message.from;
                    const text = message.text ? message.text.body : null;

                    const newMessage = {
                        from,
                        text,
                        timestamp: new Date(),
                    }

                    // await newMessage.save();
                    console.log("Message saved:", newMessage);
                }
            });
        });

        return res.status(200).send("EVENT_RECEIVED");
    }

    res.sendStatus(404);
});





module.exports = router;


