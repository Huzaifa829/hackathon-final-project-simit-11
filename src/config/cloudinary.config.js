import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import fs from "fs"
dotenv.config();

cloudinary.config({
  cloud_name: 'dlcizzaa8',
  api_key: '252984694466497',
  api_secret: 'w6uGWoqWxioFTquswkQ_jjPA2j0', // Click 'View API Keys' above to copy your API secret
});
const uploadImageToCloudinary = async (localFile) => {
  try {
    const response = await cloudinary.uploader.upload(localFile, {
      resource_type: "auto",
    });

    fs.unlink(localFile, (err) => {
      if (err) console.log("Error deleting local file:", err);
    });

    return response.url;
  } catch (error) {
    console.log(error);
    return "Error in uploading file to cloudinary", error;
  }
};
export {cloudinary,uploadImageToCloudinary};
