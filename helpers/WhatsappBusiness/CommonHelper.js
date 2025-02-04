const { uploadFile } = require("../../controllers/Ancillary/SpaceController");
const axios = require("axios");

const uploadImageWhatsapp = async (imageData) => {
    try {
        const imageId = imageData?.id;
        const mediaType = imageData?.mime_type?.split("/")?.[1] || "jpeg";
        const imageName = `Whatsapp/Onboarding/${imageId}.${mediaType}`;

        const imageMetaUrl = `https://graph.facebook.com/v21.0/${imageId}`;
 
        const headers = {
            Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
        };
        const imageMetaResponse = await axios.get(imageMetaUrl, { headers });
      
        if (!imageMetaResponse?.data?.url) {
            console.error("Failed to fetch the image from WhatsApp.");
            return {
                statuscode: 400,
                status: "failed",
                data: {},
                error: [{ message: "Invalid image metadata", errorcode: 400 }],
            };
        }
        const imageDownloadUrl = imageMetaResponse?.data?.url;
        const imageResponse  = await axios.get(imageDownloadUrl, {
            headers,
            responseType: "arraybuffer",
        });
        // Upload the image to DigitalOcean Spaces
        const uploadResponse = await uploadFile({
            file_name: imageName,
            file: imageResponse?.data,
            content_type: imageData?.mime_type, 
        });

        if (uploadResponse?.statuscode === 500) {
            return {
            statuscode: 500,
            status: "failed",
            data: {},
            error: [{ message: "Unable to upload image", errorcode: 500 }],
            };
        }
        return {
            statuscode: 200,
            status: "success",
            data: { message: uploadResponse?.message || "Image uploaded successfully", image_name:imageName },
        };
    } catch (err) {
        console.error("❌ Error in uploadImageWhatsapp:", err.message);
        return {
            statuscode: 500,
            status: "failed",
            data: {},
            error: [{ message: "Internal server error", errorcode: 500 }],
        };
    }
        
};
// let imageData = {
//   mime_type: "image/jpeg",
//   sha256: "+QTUysI4khpbMw+3GI66oSXNzR14sLxvzAX/GLNOlaQ=",
//   id: "1570481083608290",
// };

// uploadImageWhatsapp(imageData)

module.exports = {
  uploadImageWhatsapp,
};
