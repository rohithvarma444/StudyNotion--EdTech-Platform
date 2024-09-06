const cloudinary = require("cloudinary").v2;
require("dotenv").config();
const tempFilePath = process.env.FOLDER_NAME;

exports.uploadImageToCloudinary = async(file,folder,height,quality) => {
    const options = {folder};
    if(height){
        options.height = height;
    }
    if(quality){
        options.quality = quality;
    }
    options.resource_type = "auto";

    return await cloudinary.uploader.upload(file.tempFilePath,options);
}