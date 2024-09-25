const cloudinary = require("cloudinary").v2;
const tempFilePath = "video"
exports.videoUploader = async (file, folder) => {
    const options = {folder};

    options.resource_type = "video";

    return await cloudinary.uploader.upload(file.tempFilePath, options);
}