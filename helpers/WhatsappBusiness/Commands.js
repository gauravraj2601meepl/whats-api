const { sendWhatsAppMessage, sendMessage } = require("./MessageHelper");
const { sendTemplateMessage1 } = require("./MessageTemplate");
const { jobDatas } = require("./ResponseDataStorage");


exports.handleCommand = async (text, from, profileName) => {
    const regex = /^\/meepl onboarding/;
    const command = text?.match(regex)?.[0]; 
    
    if (command === "/meepl onboarding") {
        const encVal = text?.replace(command, "")?.trim();

        if (encVal) {
          await sendMessage({
              number: from,
              type: "interactive", 
              message:
                "WELCOME TO MEEPL! 🎉\nHi there! We're excited to get you onboarded.\n\nClick Start to begin your onboarding process.",
              buttons: [
                  { type: "reply",
                      reply: {
                          id: `start_onboarding_${encVal}`,
                          title: "Start"
                      }
                  }
              ],
            });
        } else {
          // If no dynamic part is provided
          await sendMessage({
            number: from,
            message: "❌ Please provide a valid identifier after '/meepl onboarding'.",
          });
        }
      }
      else {
        switch (text) {
          case "/start meepl":
            await sendTemplateMessage1({
              number: from,
              name: profileName,
            });
            break;
          case "/review":
            await sendMessage({
              number: from,
              name: profileName,
              message: "📝 Here's a review of your task progress!",
            });
            break;
          case "/summary":
            await sendMessage({
              number: from,
              name: profileName,
              message: "👁️ Here's your overall summary update.",
            });
            break;
          case "/showlists":
            await sendMessage({
              number: from,
              name: profileName,
              message: "📋 Here are all your task lists.",
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
            jobDatas[from] = { step: 0 }; //Initialize the job creation process
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
      }
};


exports.sendListMessage = async ({ number, name }) => {
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
                id: "/review",
                title: "📝 Review Tasks",
                description: "Get a review of tasks",
              },
              {
                id: "/summary",
                title: "👁️ Summary",
                description: "Overall summary update",
              },
              {
                id: "/showlists",
                title: "📋 Show Task Lists",
                description: "View your task lists",
              },
            ],
          },
          {
            title: "Job Commands",
            rows: [
              {
                id: "/addjob",
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