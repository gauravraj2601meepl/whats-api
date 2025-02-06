const { uploadFile } = require("../../controllers/Ancillary/SpaceController");
const axios = require("axios");
const {
  OnboardWhatsappCanidate,
} = require("../../controllers/OnboardController");
const Location_Module = require("../../models/Location/Location2");

const uploadFileWhatsapp = async (mediaData, media_type) => {
  try {
    const media = mediaData?.mime_type;
    if (media_type === "image" && media?.split("/")?.[0] !== "image") {
      return { validation: "fail" };
    }
    if (media_type === "resume" && media?.split("/")?.[1] !== "pdf") {
      return { validation: "fail" };
    }
    const fileId = mediaData?.id;
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
    const fileResponse = await axios.get(fileDownloadUrl, {
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
      console.log(err, {
        message: `Error occured while uploadig ${media} file`,
        statuscode: 500,
      });
      return {
        statuscode: 500,
        status: "failed",
        data: {},
        error: [
          {
            message: `Error occured while uploadig ${media} file`,
            errorcode: 500,
          },
        ],
      };
    }
    console.log({
      message: `File ${media} uploaded successfully`,
      statuscode: 200,
    });
    return {
      statuscode: 200,
      status: "success",
      data: {
        message: uploadResponse?.message || "File uploaded successfully",
        file_name: fileName,
      },
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
const findDistanceLocation = async (location, from, sendMessage) => {
  const { address, name, latitude, longitude } = location;
  const shopLat = 26.820820328830113,
    shopLon = 85.1301515022516;

  const distance = getDistanceFromLatLon(shopLat, shopLon, latitude, longitude);
  let location_type=""

  // Determine message based on address and name
  if (!address && !name) {
    location_type = "Current Location";
  } else {
    location_type = "Any Location";
  }

  const newLocation = new Location_Module({
    distance: distance,
    user: from,
    location_type: location_type, 
    address: address ? address : null, 
    name: name ? name : null,
  });

  const result = await newLocation.save();
  console.log("result", result);

  await sendMessage({
    number: from,
    message: "🎉 Thank you for sharing your location",
  });

  return;
};

const getDistanceFromLatLon = (fixLat, fixLon, resLat, resLon) => {
  const R = 6371000; // Radius of Earth in meters
  const toRadians = (degree) => degree * (Math.PI / 180);

  const φ1 = toRadians(fixLat);
  const φ2 = toRadians(resLat);
  const Δφ = toRadians(resLat - fixLat);
  const Δλ = toRadians(resLon - fixLon);

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = R * c; // Distance in meters
  return distance.toFixed(2);
};

// // Example Usage
// const locationData = {
//     address: "<LOCATION_ADDRESS>", // Optional
//     latitude: <LOCATION_LATITUDE>,
//     longitude: <LOCATION_LONGITUDE>,
//     name: "<LOCATION_NAME>", // Optional
// };

module.exports = {
  uploadFileWhatsapp,
  findDistanceLocation,
};
