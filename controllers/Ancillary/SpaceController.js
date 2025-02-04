const { PutObjectCommand, ListObjectsCommand, S3, DeleteObjectCommand } = require("@aws-sdk/client-s3");

const s3Client = new S3({
    forcePathStyle: false, // Configures to use subdomain/virtual calling format.
    endpoint: "https://nyc3.digitaloceanspaces.com",
    region: "nyc3",
    credentials: {
        accessKeyId: process.env.SPACES_KEY,
        secretAccessKey: process.env.SPACES_SECRET
    }
});

// Uploads the specified file to the chosen path.
const uploadFile = async (params) => {
    let { file, file_name, content_type } = params
    const bucketParams = {
        Bucket: process.env.BUCKET_NAME,
        Key: file_name,
        Body: file,
        ContentType: content_type,
    };
    try {
        const data = await s3Client.send(new PutObjectCommand(bucketParams));
        console.log({ message: "Image uploaded successfully", statuscode: 200 })
        return { message: "Image uploaded successfully", statuscode: 200 }
    } catch (err) {
        console.log(err,{ message: "Error occured while uploadig image", statuscode: 500 })
        return { message: "Error occured while uploadig image", statuscode: 500 }
    }
};
console.log("hai")

// Delete a file from space
const deleteFile = async (params) => {
    let { file_name } = params
    const bucketParams = { Bucket: process.env.BUCKET_NAME, Key: file_name };
    try {
        const data = await s3Client.send(new DeleteObjectCommand(bucketParams));
        return { message: "File deleted successfully", statuscode: 200 }
    } catch (err) {
        return { message: "Error occured while deleting file", statuscode: 500 }
    }
};

// Returns a list of objects in your specified path.
const getFiles = async (req, res) => {
    try {
        const data = await s3Client.send(new ListObjectsCommand(bucketParams));
        console.log("Success", data);
        return data;
    } catch (err) {
        console.log("Error", err);
        return { error: "error occured" }
    }
};

// To get a file from space for email sharing
const getFile = async (params) => {
    const bucketParams = {
        Bucket: process.env.BUCKET_NAME,
        Key: params?.file_name,
    };
    try {
        const data = await s3Client.getObject(bucketParams)
        console.log({ message: "File retrieved successfully", statuscode: 200, data: data })
        return { message: "File retrieved successfully", statuscode: 200, data: data }
    } catch (err) {
        console.log({ message: "Error occured while retrieving file", statuscode: 500 })
        return { message: "Error occured while retrieving file", statuscode: 500 }
    }
};


module.exports={
    uploadFile,
    deleteFile,
    getFile,
    getFiles
}