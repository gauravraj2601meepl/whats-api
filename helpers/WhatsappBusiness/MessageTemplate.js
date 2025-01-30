const { default: axios } = require("axios");
require("dotenv").config();


exports.sendTemplateMessage1 = async (req) => {
    try {
        const {number, name} = req
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
        return {
            statuscode: 200,
            status: "success_meepl_welcome",
            data: response.data,
            error: [{ message: "", errorcode: "" }],
        };
        
    } catch (err) {
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
        return {
            statuscode: 200,
            status: "success_hello_world",
            data: response.data,
            error: [{ message: "", errorcode: "" }],
        };
    } catch (err) {
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
