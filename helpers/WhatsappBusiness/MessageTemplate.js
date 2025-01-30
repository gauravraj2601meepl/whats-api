const { default: axios } = require("axios");
require("dotenv").config();


exports.sendTemplateMessage1 = async (req,res) => {
    try {
        const {number, name} = req
        console.log("nameeeee", number, name)
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
        console.log("res_data", response.res_data)
        return res_data = response.data || 'Unknown';
        
    } catch (err) {
        // Handle any errors that occur
        console.log("errWhatsAppRes", err?.message, err?.response?.data)
       
    }
};

exports.sendTemplateMessage2 = async (req) => {
    const {number, name} = req
    console.log("numberrrrrrrrrrrr", number, name)
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
        console.log("res_data", response.res_data)
        return res_data = response.data || 'Unknown';
       
    } catch (err) {
        console.log("errWhatsAppRes", err?.message, err?.response?.data)
       
    }
};
