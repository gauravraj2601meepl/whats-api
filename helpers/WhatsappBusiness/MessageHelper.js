const { default: axios } = require("axios");
const { sendTemplateMessage1, sendTemplateMessage2 } = require("./MessageTemplate");
require("dotenv").config();

exports.sendWhatsAppMessage = async (data) => {
  try {
    const url = `${process.env.WHATSAPP_API}/messages`;
    const headers = {
      Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
      "Content-Type": "application/json",
    };
    const response = await axios.post(url, data, { headers });
    const res_data = response.data || "Unknown";
    console.log("res_data_sendWhatsAppMessage", res_data);
    return response.data;
  } catch (err) {
    console.log(
      "err.sendWhatsAppMessage",
      err.message,
      "sendWhatsAppMessage.response.data",
      err.response?.data
    );
  }
};

exports.sendMessage = async (req) => {
  const { number, name, message, type, buttons } = req;
  try {
    const url = `${process.env.WHATSAPP_API}/messages`;
    const headers = {
      Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
      "Content-Type": "application/json",
    };
    const data = {
      messaging_product: "whatsapp",
      to: number,
    };

    if (type === "interactive") {
      // Handle interactive messages
      data.type = "interactive";
      data.interactive = {
        type: "button",
        action: {
          buttons: buttons,
        },
      };
      if (message) {
        data.interactive.body = {
          text: message,
        };
      }
    } else {
      // Handle regular text messages
      data.type = "text";
      const bodyText = name ? `${name} - ${message}` : message;
      data.text = {
        body: bodyText,
      };
    }

    const response = await axios.post(url, data, { headers });
    const res_data = response.data || "Unknown";
    console.log("res_data_sendMessage", res_data);
  } catch (err) {
    console.log(
      "sendMessage_err.messsages",
      err.message,
      "sendMessage_err.response.data",
      err.response?.data
    );
  }
};

exports.sendTemplateMessage = async (req, res) => {
  const { number, name, template } = req.body;
  console.log("Template:", template, "Number:", number, "Name:", name);

  try {
    let res_data;

    // Based on the template, call the respective function
    if (template === "hello_world") {
      res_data = await sendTemplateMessage2({ number, name });
    } else if (template === "meepl_welcome") {
      res_data = await sendTemplateMessage1({ number, name });
    } else {
      return res.status(400).json({
        statuscode: 400,
        status: "failed",
        data: null,
        error: [{ message: "Invalid template name", errorcode: 400 }],
      });
    }
    return res.status(200).json({
      statuscode: 200,
      status: "success",
      template: `${template} to ${number}`,
      data: res_data || "validation error",
      error: res_data
        ? null
        : [
            {
              status: res?.response?.data?.error?.message,
              message: res?.response?.error,
              errorcode: res?.response?.data?.error?.error_subcode,
            },
          ],
    });
  } catch (err) {
    console.log("errWhatsAppRes", err, err.message, err.response?.data);
    res.status(500).json({
      statuscode: 500,
      status: "failed",
      template: template,
      data: null,
      error: [{ message: err.message || err.response?.data, errorcode: 500 }],
    });
  }
};
/////////////////////

exports.sendTextMessage = async (req, res) => {
  const { number, name, message } = req.body;
  try {
    const url = `${process.env.WHATSAPP_API}/messages`;
    const headers = {
      Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
      "Content-Type": "application/json",
    };
    const data = {
      messaging_product: "whatsapp",
      to: number,
      type: "text",
      text: {
        body: `${name}- ${message}`,
      },
    };
    const response = await axios.post(url, data, { headers });
    const res_data = response.data || "Unknown";
    console.log("res_data_textMessage", res_data);
    return res.status(200).json({
      statuscode: 200,
      status: "success",
      data: res_data,
      error: [{ message: "", errorcode: "" }],
    });
  } catch (err) {
    console.log("errWhatsAppRes", err, err.message, err.response?.data);
    res.status(500).json({
      statuscode: 500,
      status: "failed",
      data: null,
      error: [{ message: err.message, errorcode: 500 }],
    });
  }
};

exports.sendTextMessagePreview = async (req, res) => {
  const { number, name, message } = req.body;
  try {
    const url = `${process.env.WHATSAPP_API}/messages`;
    const headers = {
      Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
      "Content-Type": "application/json",
    };
    const data = {
      messaging_product: "whatsapp",
      to: number,
      type: "image",
      image: {
        // link: "https://meepldevstorage.nyc3.digitaloceanspaces.com/fulllogo.PNG", 
        link: "https://i.ibb.co/zh38G0W/Untitled.png", 
        caption: "Meepl \nhttps://wa.me/15551584583?text=%2Fstart%20meepl\n\nThank you for reaching out!", 
      },
    };
    const response = await axios.post(url, data, { headers });
    const res_data = response.data || "Unknown";
    console.log("res_data_textMessage", res_data);
    return res.status(200).json({
      statuscode: 200,
      status: "success",
      data: res_data,
      error: [{ message: "", errorcode: "" }],
    });
  } catch (err) {
    console.log("errWhatsAppRes", err.message, err.response?.data);
    res.status(500).json({
      statuscode: 500,
      status: "failed",
      data: null,
      error: [{ message: err.message, errorcode: 500 }],
    });
  }
};