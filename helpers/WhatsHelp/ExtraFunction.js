const { default: axios } = require("axios");




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


