/*

{
    "messaging_product": "whatsapp",
    "recipient_type": "individual",
    "to": "9779815877208",
    "type": "interactive",
    "interactive": {
      "type": "button",
      "body": {
        "text": "Would you like to confirm your table reservation?"
      },
      "footer": {
        "text": "Please choose an option below."
      },
      "action": {
        "buttons": [
          {
            "type": "reply",
            "reply": {
              "id": "confirm",
              "title": "✅ Confirm"
            }
          },
          {
            "type": "reply",
            "reply": {
              "id": "cancel",
              "title": "❌ Cancel"
            }
          }
        ]
      }
    }
  }

  {
  "messaging_product": "whatsapp",
  "recipient_type": "individual",
  "to": "1234567890",
  "type": "interactive",
  "interactive": {
    "type": "list",
    "header": {
      "type": "text",
      "text": "Select an Appointment Slot"
    },
    "body": {
      "text": "Please choose a suitable time for your appointment."
    },
    "footer": {
      "text": "Tap on a slot to select."
    },
    "action": {
      "button": "Choose a Time",
      "sections": [
        {
          "title": "Morning Slots",
          "rows": [
            {
              "id": "slot_9am",
              "title": "09:00 AM - 10:00 AM"
            },
            {
              "id": "slot_11am",
              "title": "11:00 AM - 12:00 PM"
            }
          ]
        },
        {
          "title": "Afternoon Slots",
          "rows": [
            {
              "id": "slot_2pm",
              "title": "02:00 PM - 03:00 PM"
            },
            {
              "id": "slot_4pm",
              "title": "04:00 PM - 05:00 PM"
            }
          ]
        }
      ]
    }
  }
}

  
    */