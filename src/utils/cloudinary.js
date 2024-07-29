import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: `${process.env.CLOUDINARY_CLOUD_NAME}`,
  api_key: `${process.env.CLOUDINARY_API_KEY}`,
  api_secret: `${process.env.CLOUDINARY_SECRET_KEY}`,
});

export const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    // upload file on cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    console.log(`response - ${response}`)
    console.log("File uploaded successfully", response.url);
    return response;
  } 
  catch (error) {
    console.log('clodinary error - ',error);
  }
};

