import { asyncHandler } from "../utils/asyncHandler.js";
import ApiErrors from "../utils/apiErrors.js";
import { User } from "../models/user.models.js";
import {uploadOnCloudinary} from '../utils/cloudinary.js'
const registerUser = asyncHandler(async (req, res) => {
  const body = req.body;
  if (
    [body.fullname, body.email.body.password, body.username].some(
      (item) => item?.trim() === ""
    )
  ) {
    throw new ApiErrors(400, "All fields required");
  }
  const existingUser = User.findOne({
    $or: [body.username, body.email],
  });

  if (existingUser) {
    throw new ApiErrors(
      409,
      "user with this email or username already existed "
    );
  }

  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImageLocalPath = req.files?.coverImage[0].path;

  if(!avatarLocalPath){
    throw new ApiErrors(400,"Avatar file is required");
  }
  const avatar = await uploadOnCloudinary(avatarLocalPath)
  const coverImage = await uploadOnCloudinary(coverImageLocalPath)

  if(!avatar){
    throw new ApiErrors(400,"Avatar is not uploaded .. reupload")
  }

  // creating user 
  const user = await User.create({
    username:body.username,
    avatar:avatar.url,
    coverImage:coverImage?.url || "",
    username:body.username.toLowerCase(),
    email:body.email,
    password:body.password,
  })
  

  res.status(200).send();
});

export default registerUser;
