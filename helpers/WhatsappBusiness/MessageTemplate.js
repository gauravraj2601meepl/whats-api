const { default: axios } = require("axios");
require("dotenv").config();


exports.sendTemplateMessage1 = async (req,res) => {
    try {
        const {number, name} = req
        console.log("Sending meepl_welcome template message to:", number, name);
        const url = `${process.env.WHATSAPP_API}/messages`;
        const headers = {
            "Authorization": `Bearer ${process.env.WHATSAPP_TOKEN}`,
            "Content-Type": "application/json",
        };
        const data = {
            messaging_product: "whatsapp",
            to: number, // recipient's phone number
            type: "template",
            template: {
                name: "meepl_welcome",
                language: {
                    code: "en_US", 
                },
                components: [
                    {
                        type: "header",
                        parameters: [
                          {
                            type: "image",
                            image: {
                              link: "https://meepldevstorage.nyc3.digitaloceanspaces.com/fulllogo.PNG", // Provide a valid image URL
                            }
                          }
                        ]
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
                ],
            },
        };
        const response = await axios.post(url,data,{headers});
        console.log("WhatsApp API Response meepl_welcome template:", response.data);
        return {
            statuscode: 200,
            status: "success_meepl_welcome",
            data: response.data,
            error: [{ message: "", errorcode: "" }],
        };
        
    } catch (err) {
        console.error("WhatsApp API Error meepl_welcome template:", err?.message, err?.response?.data);
        return {
            statuscode: 500,
            status: "failed",
            data: null,
            error: [
                {
                    message: err?.message || "Unknown error",
                    errorcode: err?.response?.status || 500,
                    details: err?.response?.data || {},
                },
            ],
        };
    }
};

exports.sendTemplateMessage2 = async (req) => {
    const {number, name} = req
    console.log("Sending hello_world template to:", number, name);
    try {
        const url = `${process.env.WHATSAPP_API}/messages`;
        const headers = {
            "Authorization": `Bearer ${process.env.WHATSAPP_TOKEN}`,
            "Content-Type": "application/json",
        };
        const data = {
            messaging_product: "whatsapp",
            to: number, 
            type: "template",
            template: {
                name: "hello_world", 
                language: {
                    code: "en_US", 
                },
            },
        };
        const response = await axios.post(url,data,{headers});
        console.log("WhatsApp API Response hello_world template:", response.data);
        return {
            statuscode: 200,
            status: "success_hello_world",
            data: response.data,
            error: [{ message: "", errorcode: "" }],
        };
    } catch (err) {
        console.error("WhatsApp API Error hello_world template::", err?.message, err?.response?.data);

        return {
            statuscode: 500,
            status: "failed_hello_world",
            data: null,
            error: [
                {
                    message: err?.message || "Unknown error",
                    errorcode: err?.response?.status || 500,
                    details: err?.response?.data || {},
                },
            ],
        };
    }
};
