const uploadImageWhatsapp = async (imageData) => {
        const imageId = imageData.id;
        const imageName = `Whatsapp/Onboarding/${imageId}.jpg`; 
console.log("imageName")
        const imageUrl = `https://graph.facebook.com/v15.0/${imageId}`;
console.log("imageUrl", imageUrl);
        const accessToken = process.env.WHATSAPP_TOKEN; // Replace with your access token

        const imageResponse = await fetch(imageUrl, {
            headers: {
            Authorization: `Bearer ${accessToken}`,
            },
        });
console.log("imageResponse", imageResponse)
        if (!imageResponse.ok) {
            console.error("Failed to fetch the image from WhatsApp");
            return;
        }

        const imageBuffer = await imageResponse.buffer();

        // Upload the image to DigitalOcean Spaces
        const uploadResponse = await uploadFile({
            file_name: imageName,
            file: imageBuffer,
            content_type: "image/jpeg", // Update content type if necessary
        });

        if (uploadResponse.statuscode === 500) {
            return {
            statuscode: 500,
            status: "failed",
            data: {},
            error: [{ message: "Unable to upload image", errorcode: 500 }],
            };
        }

        console.log("Image uploaded successfully:", uploadResponse);
        return {
            statuscode: 200,
            status: "success",
            data: {"Image uploaded successfully:": uploadResponse, imageName},
            };

};



module.exports = {
    uploadImageWhatsapp
}