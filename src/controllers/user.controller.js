import { asyncHandler } from "../utils/asyncHandler.js";
import ApiErrors from "../utils/apiErrors.js";
import ApiResponse from "../utils/ApiResponse.js";
import { User } from "../models/user.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const registerUser = asyncHandler(async (req, res) => {

  const body = req.body;
  if (
    [body.fullname, body.email,body.password, body.username].some(
      (item) => item?.trim() === ""
    )
  ) {
    throw new ApiErrors(400, "All fields required");
  }
  
  const existingUser = await User.findOne({email:body.email});

  if (existingUser) {
    throw new ApiErrors(
      409,
      "user with this email or username already existed "
    );
  }

  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImageLocalPath = req.files?.coverImage[0]?.path;

  if (!avatarLocalPath) {
    throw new ApiErrors(400, "Avatar file is required");
  }
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!avatar) {
    throw new ApiErrors(400, "Avatar is not uploaded .. reupload");
  }

  // creating user
  const user = await User.create({
    fullname:body.fullname,
    username: body.username,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    username: body.username.toLowerCase(),
    email: body.email,
    password: body.password,
  });

  const userCreated = User.findById(user._id).select("-password -refreshToken");

  if (!userCreated) {
    throw new ApiErrors(500, "Somthing went wrong while creating User");
  }

  res.status(201).json(new ApiResponse(200, "User Created Successfully"));
});

export default registerUser;
