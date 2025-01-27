const express = require("express");
const router = express.Router();


const { sendTemplateMessage, sendTextMessage, sendMessage } = require("../controller/WhatsappTestController");
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
    

console.log("req.bodyMain", JSON.stringify(body, null,2))
    if (body.object === "whatsapp_business_account") {
        body.entry.forEach(async (entry) => {
            entry.changes.forEach(async (change) => {
                let profileName;
                let newMessage;
                const messageData = change.value.messages;
                const contactData = change.value.contacts;

                if (contactData && contactData.length > 0) {
                     profileName = contactData[0].profile.name
                    console.log("profileName:", profileName)
                }

                if (messageData && messageData.length > 0) {
                    const message = messageData[0];
                    const from = message.from;
                    const text = message.text ? message.text.body : null;

                     newMessage = {
                        from,
                        text,
                        timestamp: new Date(),
                    }

                    // await newMessage.save();
                    console.log("Message saved:", newMessage);

                }
                if(newMessage) {
                    sendMessage({number: newMessage.from, name:profileName, message:`This is a message reply of ${newMessage.text}`})
                }
            });
        });

        return res.status(200).send("EVENT_RECEIVED");
    }

    res.sendStatus(404);
});





module.exports = router;


