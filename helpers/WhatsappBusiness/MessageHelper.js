const { default: axios } = require("axios");
const {
  sendTemplateMessage1,
  sendTemplateMessage2,
} = require("./MessageTemplate");
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
    console.log("res_sendWhatsAppMessage", res_data);
    return res_data;
  } catch (err) {
    console.log("err_sendWhatsAppMessage", err.message, err.response?.data);
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
      data.type = "text";
      const bodyText = name ? `${name} - ${message}` : message;
      data.text = {
        body: bodyText,
      };
    }

    const response = await axios.post(url, data, { headers });
    const res_data = response.data || "Unknown";
    console.log("res_sendMessage", res_data);
    return res_data;
  } catch (err) {
    console.log("err_sendMessage", err.message, err.response?.data);
    return err.message;
  }
};

exports.sendLocationRequestMessage = async (req, res) => {
  const { number } = req.body;
  try {
    const url = `${process.env.WHATSAPP_API}/messages`;
    const headers = {
      Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
      "Content-Type": "application/json",
    };
    const data = {
      messaging_product: "whatsapp",
      to: number,
      recipient_type: "individual", // group also
        type: "interactive",
        interactive: {
            type: "location_request_message",
            body: {
            text: "Please share Your Current location"
            },
            action: {
            name: "send_location"
            }
        }
    };
    const response = await axios.post(url, data, { headers });
    const res_data = response.data || "Unknown";
    console.log("res_sendLocationRequestMessage", res_data);
    return res?.status(200).json({
      statuscode: 200,
      status: "success",
      data: res_data,
      error: [{ message: "", errorcode: "" }],
    });
  } catch (err) {
    console.log("err_sendLocationRequestMessage", err.message, err.response?.data);
    res?.status(500).json({
      statuscode: 500,
      status: "failed",
      template: template,
      data: null,
      error: [
        {
          message: err?.message || "Unknown error",
          errorcode: err?.response?.status || 500,
          details: err?.response?.data || {},
        },
      ],
    });
  }
};

exports.sendTemplateMessage = async (req, res) => {
  const { number, name, template } = req.body;

  try {
    let responseData;

    if (template === "hello_world") {
      responseData = await sendTemplateMessage2({ number, name });
    } else if (template === "meepl_welcome") {
      responseData = await sendTemplateMessage1({ number, name });
    } else {
      return res.status(400).json({
        statuscode: 400,
        status: "failed",
        data: null,
        error: [{ message: "Invalid template name", errorcode: 400 }],
      });
    }

    if (responseData.statuscode === 200) {
      return res.status(200).json({
        statuscode: 200,
        status: "success",
        template: `${template} sent to ${number}`,
        data: responseData.data,
        error: [{ message: "", errorcode: "" }],
      });
    } else {
      return res.status(500).json({
        statuscode: 500,
        status: "failed",
        template: template,
        data: null,
        error: responseData.error,
      });
    }
  } catch (err) {
    res.status(500).json({
      statuscode: 500,
      status: "failed",
      template: template,
      data: null,
      error: [
        {
          message: err?.message || "Unknown error",
          errorcode: err?.response?.status || 500,
          details: err?.response?.data || {},
        },
      ],
    });
  }
};

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
    return res.status(200).json({
      statuscode: 200,
      status: "success",
      data: res_data,
      error: [{ message: "", errorcode: "" }],
    });
  } catch (err) {
    res.status(500).json({
      statuscode: 500,
      status: "failed",
      template: template,
      data: null,
      error: [
        {
          message: err?.message || "Unknown error",
          errorcode: err?.response?.status || 500,
          details: err?.response?.data || {},
        },
      ],
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
        link: "https://i.ibb.co/zh38G0W/Untitled.png",
        // link: "https://meepldevstorage.nyc3.digitaloceanspaces.com/fulllogo.PNG",
        caption:
          "Meepl \nhttps://wa.me/15551584583?text=%2Fstart%20meepl\n\nThank you for reaching out!",
      },
    };
    const response = await axios.post(url, data, { headers });
    const res_data = response.data || "Unknown";
    return res.status(200).json({
      statuscode: 200,
      status: "success",
      data: res_data,
      error: [{ message: "", errorcode: "" }],
    });
  } catch (err) {
    res.status(500).json({
      statuscode: 500,
      status: "failed",
      template: template,
      data: null,
      error: [
        {
          message: err?.message || "Unknown error",
          errorcode: err?.response?.status || 500,
          details: err?.response?.data || {},
        },
      ],
    });
  }
};
