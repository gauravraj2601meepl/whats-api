const { default: axios } = require("axios");


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


// sendTextMessage()

exports.sendMessage = async (req) => {
    const {number, name, message, type, buttons} = req
    try {
        const url = `${process.env.WHATSAPP_API}/messages`;
        const headers = {
            "Authorization": `Bearer ${process.env.WHATSAPP_TOKEN}`,
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
                body: {
                    text: message || "Please select an option"
                },
                action: {
                    buttons: buttons
                }
            };
        }
        else {
            // Handle regular text messages
            data.type = "text";
            const bodyText = name ? `${name} - ${message}` : message;
            data.text = {
                body: bodyText
            };
        }

        const response = await axios.post(url,data,{headers});
        const res_data = response.data || 'Unknown';
        console.log("res_data_textMessage", res_data)
        
    } catch (err) {
        console.log("err.messsages",err.message, "err.response.data",err.response?.data)
    }
}

exports.sendWhatsAppMessage = async (data) => {
    const url = `${process.env.WHATSAPP_API}/messages`;
    const headers = {
        "Authorization": `Bearer ${process.env.WHATSAPP_TOKEN}`,
        "Content-Type": "application/json",
    };
    const response = await axios.post(url,data,{headers});
    return response.data;
  };
  


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
        console.log("errWhatsAppRes", err.message, err.response?.data)
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
        console.log("errWhatsAppRes", err.message, err.response?.data)
    }
}
// sendImage()


