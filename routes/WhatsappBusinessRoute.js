const express = require("express");

const router = express.Router();

const {
  sendTemplateMessage,
  sendTextMessage,
  sendTextMessagePreview,
} = require("../controller/WhatsappTestController");
const {
  sendTemplateMessage1,
  sendMessage,
  sendWhatsAppMessage,
} = require("../controller/HelperFunctions");
const { getUserState, handleUserResponse, handleAddJobFlow, updateUserState } = require("../controller/Helper/AddJobHelper");
const { jobData, userData } = require("../controller/Helper/JobDataStorage");
router.post("/sendWhatsappTemplate", sendTemplateMessage);
router.post("/sendTextMessage", sendTextMessage);
router.post("/sendMeeplInfo", sendTextMessagePreview);
router.get("/webhook", (req, res) => {
  const VERIFY_TOKEN = "meepl";
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token === VERIFY_TOKEN) {
    console.log("Webhook Verified");
    return res.status(200).send(challenge);
  }

  res.sendStatus(403);
});

router.post("/webhook", async (req, res) => {
  const body = req.body;

//   console.log("req.bodyMain", JSON.stringify(body.entry[0].changes[0], null, 2));
  if (body.object === "whatsapp_business_account") {
    body.entry.forEach(async (entry) => {
      entry.changes.forEach(async (change) => {
        let profileName;
        let newMessage;
        const messageData = change.value.messages;
        const contactData = change.value.contacts;
        if (contactData && contactData.length > 0) {
          profileName = contactData[0].profile.name;
          console.log("profileName:", profileName);
        }

        if (messageData && messageData.length > 0) {
          const message = messageData[0];
          const from = message.from;
          const text = message.text ? message.text.body : null;
          const interactiveData = message.interactive;

          newMessage = {
            from,
            text,
            timestamp: new Date(),
          };
          console.log("Message received:", newMessage);

          let userState;
        //   const userId = from; // Ensure `from` is correctly set
        //     if (!jobData.userStates[userId]) {
        //         console.log("ifffff",jobData.userStates[userId])
        //     }
        //     else{
        //         console.log("else", jobData.userStates[userId])
        //     }
          // Check if message starts with "/"
          if (text === "/") {
            await sendListMessage({
              number: from,
              name: profileName,
            });
          } 
           else if (interactiveData && interactiveData.list_reply){
            const selectedCommandId = interactiveData.list_reply.id;
            await handleCommand(
              selectedCommandId,
              from,
              contactData[0].profile.name
            );
          } else if (interactiveData && interactiveData.button_reply){
            const buttonId = interactiveData.button_reply.id;
            if (buttonId === "start_onboarding") {
                // Update user state to "start"
                userData[from] = { step: 0 };
                // Send the first onboarding prompt
                await sendMessage({
                    number: from,
                    message: "Welcome to Meepl! Please share your *First Name* to begin.",
                });
                return;
              }
          } else if (text && text.startsWith("/")) {
            // Handle different commands
            await handleCommand(text, from, contactData[0].profile.name);
          } else if (userData[from]) {
            await handleUserResponse(text, from, sendMessage)
          } else if (jobData[from]) {
            await handleAddJobFlow(from, text, sendMessage);
          } else {
            // If the message is not a command, show a default message
            await sendMessage({
              number: from,
              name: profileName,
              message: "👋 Welcome! Type / to see the available commands.",
            });
          }
        }
      });
    });

    return res.status(200).send("EVENT_RECEIVED");
  }

  res.sendStatus(404);
});

const handleCommand = async (text, from, profileName) => {
  switch (text) {
    case "/start meepl":
      await sendTemplateMessage1({
        number: from,
        name: profileName,
      });
      break;
    case "/review":
    case "1":
      await sendMessage({
        number: from,
        name: profileName,
        message: "📝 Here's a review of your task progress!",
      });
      break;
    case "/summary":
    case "2":
      await sendMessage({
        number: from,
        name: profileName,
        message: "👁️ Here's your overall summary update.",
      });
      break;
    case "/showlists":
    case "3":
      await sendMessage({
        number: from,
        name: profileName,
        message: "📋 Here are all your task lists.",
      });
      break;
    case "/meepl onboarding G@R":
      await sendMessage({
        number: from,
        type: "interactive", 
        message:
          "WELCOME TO MEEPL! 🎉\nHi there! We're excited to get you onboarded.\n\nClick Start to begin your onboarding process.",
        buttons: [
            { type: "reply",
                reply: {
                    id: "start_onboarding",
                    title: "Start"
                }
            }
        ],
      });
      break;
    case "/":
      await sendMessage({
        number: from,
        name: profileName,
        message:
          "ℹ️ Available Commands:\n/review - Get a review of tasks\n/summary - Overall update\n/showlists - Task lists\n/addjob -Add Job",
      });
      break;
    case "/addjob":
    case "4":
      jobData[from] = { step: 0 }; //Initialize the job creation process
      await sendMessage({
        number: from,
        message: "Let's add a new job!Please provide the Job Title.",
      });
      break;
    default:
      await sendMessage({
        number: from,
        name: profileName,
        message: "❓ Unknown command. Type / for a list of available commands.",
      });
  }
};

const sendListMessage = async ({ number, name }) => {
  const listMessage = {
    messaging_product: "whatsapp",
    to: number,
    type: "interactive",
    interactive: {
      type: "list",
      body: {
        text: "ℹ️ Available Commands:",
      },
      action: {
        button: "Choose a command",
        sections: [
          {
            title: "Task Commands",
            rows: [
              {
                id: "1",
                title: "📝 Review Tasks",
                description: "Get a review of tasks",
              },
              {
                id: "2",
                title: "👁️ Summary",
                description: "Overall summary update",
              },
              {
                id: "3",
                title: "📋 Show Task Lists",
                description: "View your task lists",
              },
            ],
          },
          {
            title: "Job Commands",
            rows: [
              {
                id: "4",
                title: "➕ Add Job",
                description: "Add a new job",
              },
            ],
          },
        ],
      },
    },
  };

  await sendWhatsAppMessage(listMessage);
};
const sendCommandOptions = async (from) => {
  // if (interactiveData && interactiveData.button_reply) {
  //     const selectedCommandId = interactiveData.button_reply.id
  //     await handleCommand(selectedCommandId, from, contactData[0].profile.name)
  // }
  // else if (text === "/") {
  //     await sendCommandOptions(from);
  // }
  const commands = [
    { id: "/start meepl", title: "Meepl" },
    { id: "/review", title: "Review" },
    { id: "/summary", title: "Summary" },
    { id: "/showlists", title: "Show Lists" },
    { id: "/help", title: "Help" },
    { id: "/addjob", title: "Add Job" },
  ];

  // Helper function to send messages in chunks
  const sendInChunks = async (commandsChunk) => {
    const buttons = commandsChunk.map((cmd) => ({
      type: "reply",
      reply: {
        id: cmd.id,
        title: cmd.title,
      },
    }));

    await sendMessage({
      number: from,
      message: "📋 Select a command:",
      type: "interactive",
      buttons: buttons,
    });
  };

  // Send the commands in chunks of 3
  const chunkSize = 3;
  for (let i = 0; i < commands.length; i += chunkSize) {
    const chunk = commands.slice(i, i + chunkSize);
    await sendInChunks(chunk);
  }
  // const maxButtons = 3;
  // const limitedCommands = commands.slice(0, maxButtons);

  // const buttons = limitedCommands.map((cmd) => ({
  //     type: "reply",
  //     reply: {
  //         id: cmd.id,
  //         title: cmd.title
  //     }
  // }));

  // await sendMessage({
  //     number: from,
  //     message: "📋 Select a command:",
  //     type: "interactive",
  //     buttons: buttons
  // });
};

module.exports = router;
