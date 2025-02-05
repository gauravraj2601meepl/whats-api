const { uploadFile } = require("../../controllers/Ancillary/SpaceController");
const axios = require("axios");

const uploadFileWhatsapp = async (mediaData) => {
    try {
        const fileId = mediaData?.id;
        const media = mediaData?.mime_type;
        const mediaType = mediaData?.mime_type?.split("/")?.[1];
        const fileName = `Whatsapp/Onboarding/${fileId}.${mediaType}`;

        const fileMetaUrl = `https://graph.facebook.com/v21.0/${fileId}`;
 
        const headers = {
            Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
        };
        const fileMetaResponse = await axios.get(fileMetaUrl, { headers });
      
        if (!fileMetaResponse?.data?.url) {
            console.error(`Failed to fetch the ${media} from WhatsApp.`);
            return {
                statuscode: 400,
                status: "failed",
                data: {},
                error: [{ message: `Invalid ${media} metadata`, errorcode: 400 }],
            };
        }
        const fileDownloadUrl = fileMetaResponse?.data?.url;
        const fileResponse  = await axios.get(fileDownloadUrl, {
            headers,
            responseType: "arraybuffer",
        });

        // Upload the image to DigitalOcean Spaces
        const uploadResponse = await uploadFile({
            file_name: fileName,
            file: fileResponse?.data,
            content_type: mediaData?.mime_type, 
        });

        if (uploadResponse?.statuscode === 500) {
            console.log(err,{ message: `Error occured while uploadig ${media} file`, statuscode: 500 })
            return {
            statuscode: 500,
            status: "failed",
            data: {},
            error: [{ message: `Error occured while uploadig ${media} file`, errorcode: 500 }],
            };
        }
        console.log({ message: `File ${media} uploaded successfully`, statuscode: 200 })
        return {
            statuscode: 200,
            status: "success",
            data: { message: uploadResponse?.message || "File uploaded successfully", file_name:fileName },
        };
    } catch (err) {
        console.error("❌ Error in uploadFileWhatsapp:", err.message);
        return {
            statuscode: 500,
            status: "failed",
            data: {},
            error: [{ message: "Internal server error", errorcode: 500 }],
        };
    }
        
};
let mediaData = {
  mime_type: "application/pdf",
  sha256: "+QTUysI4khpbMw+3GI66oSXNzR14sLxvzAX/GLNOlaQ=",
  id: "2995517727254197",
};

// uploadFileWhatsapp(mediaData)

module.exports = {
  uploadFileWhatsapp,
};
