const { default: axios } = require("axios");
require("dotenv").config();

const { sendTemplateMessage1, sendTemplateMessage2 } = require("../WhatsappBusiness/MessageTemplate");
// WHATSAPP_TOKEN



exports.sendBUInfoTemplate = async(req, res) => {
  const {number, name} = req
  const url = `${process.env.WHATSAPP_API}/messages`;
  const headers = {
      "Authorization": `Bearer ${process.env.WHATSAPP_TOKEN}`,
      "Content-Type": "application/json",
  };
  const data = {
      messaging_product: 'whatsapp',
      to: number,
      type: 'template',
      template: {
          name: 'business_info_template',
          language: {
              code: 'en_US'
          },
          components: [
              {
                  type: 'header',
                  parameters: [
                      {
                          type: 'image',
                          image: {
                            link: "https://meepldevstorage.nyc3.digitaloceanspaces.com/fulllogo.PNG", // Provide a valid image URL
                          }
                      }
                  ]
              },
              {
                  type: 'body',
                  parameters: [
                      {
                          type: 'text',
                          text: 'Contact: +1 555 158 4583' // Replace with your contact number or variable
                      }
                  ]
              },
              {
                  type: 'button',
                  sub_type: 'url',
                  index: 0,
                  parameters: [
                      {
                          type: 'text',
                          text: 'https://your-website.com' // Replace with the dynamic website URL variable
                      }
                  ]
              }
          ]
      }
  };

  try {
      const response = await axios.post(url,data,{headers});
      console.log('Message sent successfully:', response.data);
  } catch (error) {
      console.error('Error sending message:', error.response ? error.response.data : error.message);
  }
}


// https://api.whatsapp.com/send?phone=15551584583&text=/
// https://bit.ly/42vLlUj
// ?text=%2F
exports.sendMeeplInfoTemplate = async(req, res) => {
  const {number, name} = req
  const url = `${process.env.WHATSAPP_API}/messages`;
  const headers = {
      "Authorization": `Bearer ${process.env.WHATSAPP_TOKEN}`,
      "Content-Type": "application/json",
  };
  const data = {
      messaging_product: 'whatsapp',
      to: number,
      type: 'template',
      template: {
          name: 'meepl_info',
          language: {
              code: 'en_US'
          },
          components: [
              {
                  type: 'header',
                  parameters: [
                      {
                          type: 'image',
                          image: {
                            link: "https://meepldevstorage.nyc3.digitaloceanspaces.com/fulllogo.PNG", // Provide a valid image URL
                          }
                      }
                  ]
              },
              {
                  type: 'body',
                  parameters: [
                      {
                          type: 'text',
                          text: "Welcome to Meepl!\n📞 Contact: +1 555 158 4583 - for number\nhttps://wa.me/15551584583?text=Hello%2C%20I%27m%20interested%20in%20your%20services - for link\n\nThank you for reaching out!"
                        }
                  ]
              },
              {
                  type: 'button',
                  sub_type: 'url',
                  index: 0,
                  parameters: [
                      {
                          type: 'text',
                          text: 'https://your-website.com' // Replace with the dynamic website URL variable
                      }
                  ]
              }
          ]
      }
  };

  try {
      const response = await axios.post(url,data,{headers});
      console.log('Message sent successfully:', response.data);
  } catch (error) {
      console.error('Error sending message:', error.response ? error.response.data : error.message);
  }
}
