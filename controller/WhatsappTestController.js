const { default: axios } = require("axios");
require("dotenv").config();
const fs = require("fs");
const { sendTemplateMessage2, sendTemplateMessage1 } = require("./HelperFunctions");
// WHATSAPP_TOKEN
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
            error: res_data ? null : [{ status:  res?.response?.data?.error?.message,message: res?.response?.error, errorcode: res?.response?.data?.error?.error_subcode }],
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
    const {number, name, message} = req.body
    try {
        const url = `${process.env.WHATSAPP_API}/messages`;
        const headers = {
            "Authorization": `Bearer ${process.env.WHATSAPP_TOKEN}`,
            "Content-Type": "application/json",
        };
        const data = {
            messaging_product: "whatsapp",
            to: number, 
            type: "text",
            text: {
                body: `${name}- ${message}`
            }
        };
        const response = await axios.post(url,data,{headers});
        const res_data = response.data || 'Unknown';
        console.log("res_data_textMessage", res_data)
        return res.status(200).json({
            statuscode: 200,
            status: "success",
            data: res_data,
            error: [{ message: "", errorcode: "" }],
        });
    } catch (err) {
        console.log("errWhatsAppRes", err, err.message, err.response?.data)
        res.status(500).json({
            statuscode: 500,
            status: "failed",
            data: null,
            error: [{ message: err.message, errorcode: 500 }],
        });
    }
}

// sendTextMessage()

exports.sendMessage = async (req) => {
    const {number, name, message} = req
    try {
        const url = `${process.env.WHATSAPP_API}/messages`;
        const headers = {
            "Authorization": `Bearer ${process.env.WHATSAPP_TOKEN}`,
            "Content-Type": "application/json",
        };
        const bodyText = name ? `${name} - ${message}` : message;
        const data = {
            messaging_product: "whatsapp",
            to: number, 
            type: "text",
            text: {
                body: bodyText
            }
        };
        const response = await axios.post(url,data,{headers});
        const res_data = response.data || 'Unknown';
        console.log("res_data_textMessage", res_data)
        
    } catch (err) {
        console.log("errWhatsAppRes", err, err.message, err.response?.data)
    }
}

const uploadLogo = async (req, res) => {
    const data = new FormData();
    data.append('messaging_product', 'whatsapp')
    const path = require('path');
    const filePath = path.join(__dirname, 'meepl-logo.png');
    data.append('file', fs.createReadStream(filePath), { contentType: 'image/png' });
    data.append('type', 'image/png')
     try {
        const url = `${process.env.WHATSAPP_API}/media`;
        const headers = {
            "Authorization": `Bearer ${process.env.WHATSAPP_TOKEN}`,
        };
        const response = await axios.post(url,data,{headers});
        const res_data = response.data || 'Unknown';
        console.log("res_data", res_data)
        if(res_data) {
            sendImage(res_data.id)
        }

    } catch (err) {
        console.log("errWhatsAppRes", err, err.message, err.response?.data)
    }
}

// res_data { id: '1829099214516157' }
// uploadLogo()

const sendImage = async (id) => {
    console.log("sendImage")
    try {
        const url = `${process.env.WHATSAPP_API}/messages`;
        const headers = {
            "Authorization": `Bearer ${process.env.WHATSAPP_TOKEN}`,
            "Content-Type": "application/json",
        };
        const data = {
            messaging_product: "whatsapp",
            to: "918083368861", 
            type: "image",
            image: {
                // link: 'https://dummyimage.com/300.png/09f/fff',
                id: id,
                caption: "Welcome to Meepl! For more details, visit [Meepl Website](https://www.meepl.day)"
            }
        };
        const response = await axios.post(url,data,{headers});
        const res_data = response.data || 'Unknown';
        console.log("res_data", res_data)
    } catch (err) {
        console.log("errWhatsAppRes", err, err.message, err.response?.data)
    }
}
// sendImage()







/*
{
                        type: "header",
                        parameters: [
                            {
                                type: "text",
                                text: name, 
                            },
                        ],
                    },
                    {
                        type: "body",
                        parameters: [
                            {
                                type: "text",
                                text: name, 
                            },
                        ],
                    },
*/