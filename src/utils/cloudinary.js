import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
cloudinary.config({
  // cloud_name: `${process.env.CLOUDINARY_CLOUD_NAME}`,
  // api_key: `${process.env.CLOUDINARY_API_KEY}`,
  // api_secret: `${process.env.CLOUDINARY_API_SECRET}`

  cloud_name:'dyfmapdxz',
  api_key: '719563144224173',
  api_secret: 'O7k3W9e8AbGomsdd6wAoz8Q-DPo',
});

export const uploadOnCloudinary = async (localFilePath) => {
  try {
    console.log("upload begin");

    if (!localFilePath) return null;
    // upload file on cloudinary
    const response = await cloudinary.uploader
      .upload(localFilePath, {
        resource_type: "auto",
      })
      .catch((err) => {
        console.log("Error upload to cloudinary - ", err);
      });
      fs.unlinkSync(localFilePath);
    return response;
  } 
  catch (error) {
    console.log("Error in try block - ",error);
    fs.unlinkSync(localFilePath);
    return null;
  }
};
