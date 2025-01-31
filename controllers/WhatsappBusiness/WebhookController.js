const {
  handleAddUserFlow,
  handleAddJobFlow,
} = require("../../helpers/WhatsappBusiness/AddFlowHelper");
const {
  sendListMessage,
  handleCommand,
} = require("../../helpers/WhatsappBusiness/Commands");
const { sendMessage } = require("../../helpers/WhatsappBusiness/MessageHelper");
const {
  userDatas,
  jobDatas,
} = require("../../helpers/WhatsappBusiness/ResponseDataStorage");
require("dotenv").config();

exports.webhookConfiguration = async (req, res) => {
  try {
    const VERIFY_TOKEN = "meepl_token";
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];
console.log("mode", mode, "token", token, "ver_token", VERIFY_TOKEN)
    if (mode && token === VERIFY_TOKEN) {
      return res.status(200).json({
        statuscode: 200,
        status: "success",
        challenge: challenge,
        error: [{ message: "", errorcode: "" }],
      });
    }
    console.log("err_token_Verify", { message: "Forbidden: Invalid token", errorcode: 400 })
    return res.status(400).json({
      statuscode: 400,
      status: "failed",
      challenge: null,
      error: [{ message: "Forbidden: Invalid token", errorcode: 400 }],
    });
  } catch (err) {
    console.log("err_res",{ message: err.message, errorcode: 500 })
    res.status(500).json({
      statuscode: 500,
      status: "failed",
      challenge: null,
      error: [{ message: err.message, errorcode: 500 }],
    });
  }
};

exports.webhookHandler = async (req, res) => {
  try {
    const body = req.body;

    if (body.object === "whatsapp_business_account") {
      body.entry.forEach(async (entry) => {
        entry.changes.forEach(async (change) => {
          const messageData = change.value.messages;
          const contactData = change.value.contacts;
          const profileName = contactData?.[0]?.profile?.name || "";

          if (messageData && messageData.length > 0) {
            const message = messageData[0];
            const from = message?.from;
            const text = message?.text?.body || null;
            const interactiveData = message?.interactive;

            console.log("Message received:", { from, text, interactiveData });

            if (text === "/") {
              await sendListMessage({
                number: from,
                name: profileName,
              });
            } else if (interactiveData?.list_reply) {
              const selectedCommandId = interactiveData.list_reply?.id;
              await handleCommand(selectedCommandId, from, profileName);
            } else if (interactiveData?.button_reply) {
              const buttonId = interactiveData.button_reply?.id.split("_");
              const encryptInfo = buttonId?.slice(2);
              if (buttonId.slice(0, 2).join("_") === "start_onboarding") {
                userDatas[from] = {
                  step: 0,
                  share_id: encryptInfo?.join("_"),
                  workspace: encryptInfo?.[1]
                };
                await sendMessage({
                  number: from,
                  message:
                    "Welcome to Meepl! Please share your *First Name* to begin.",
                });
                return;
              }
            } else if (text?.startsWith("/")) {
              await handleCommand(text, from, profileName);
            } else if (userDatas[from]) {
              await handleAddUserFlow(text, from, sendMessage);
            } else if (jobDatas[from]) {
              await handleAddJobFlow(from, text, sendMessage);
            } else {
              await sendMessage({
                number: from,
                name: profileName,
                message: "👋 Welcome! Type / to see the available commands.",
              });
            }
          }
        });
      });
      console.log("res_success",{message: "EVENT_RECEIVED"})
      return res.status(200).json({
        statuscode: 200,
        status: "success",
        message: "EVENT_RECEIVED",
        error: [{ message: "", errorcode: "" }],
      });
    }
    
    console.log("err_!whatsapp_business_account", { message: "Not Found", errorcode: 400 })
    return res.status(400).json({
      statuscode: 400,
      status: "failed",
      message: null,
      error: [{ message: "Not Found", errorcode: 400 }],
    });
  } catch (err) {
    console.log("err_webhookHandler", { message: err.message, errorcode: 500 })
    res.status(500).json({
      statuscode: 500,
      status: "failed",
      message: null,
      error: [{ message: err.message, errorcode: 500 }],
    });
  }
};
