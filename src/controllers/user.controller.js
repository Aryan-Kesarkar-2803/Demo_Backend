import { asyncHandler } from "../utils/asyncHandler.js";
import ApiErrors from "../utils/apiErrors.js";
import ApiResponse from "../utils/ApiResponse.js";
import { User } from "../models/user.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import jwt from 'jsonwebtoken'

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = await user.generateAccessTokens();
    const refreshToken = await user.generateRefreshTokens();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (err) {
    throw new ApiErrors(
      500,
      "something went wrong while generating access tokens"
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const body = req.body;
  if (
    [body.fullname, body.email, body.password, body.username].some(
      (item) => item?.trim() === ""
    )
  ) {
    throw new ApiErrors(400, "All fields required");
  }

  const existingUser = await User.findOne({ email: body.email });

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
    fullname: body.fullname,
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

const loginUser = asyncHandler(async (req, res) => {
  /**
   *  req.body -> body
   *  username or email
   * find the user
   * password check ... password wrong
   * access and refresh token send
   * send tokens in cookies
   * response that successfully login
   */
  const { email, username, password } = req.body;
  if (!(username || email)) {
    throw new ApiErrors(400, "Username or Email required");
  }

  const user = await User.findOne({
    $or: [{ username }, { email }],
  });

  console.log(user);
  if (!user) {
    throw new ApiErrors(404, "User not Exist");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiErrors(401, "Password is Invalid ");
  }

 const {accessToken,refreshToken} =  await generateAccessAndRefreshTokens(user._id);

 const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

 const options = {
    httpOnly:true,
    secure: true,
 }
 res
 .status(200)
 .cookie('accessToken',accessToken,options)
 .cookie('refreshToken',refreshToken,options)
 .json(
  new ApiResponse(200,{
    user:'LoggedInUser',
    accessToken,
    refreshToken
  },
  "User logged in Successfully"
)
 )

});

const logoutUser = asyncHandler(async (req,res) =>{
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set:{}
    },
    {
      new:true
    }
  )
  const options = {
    httpOnly:true,
    secure: true,
 }

  return res
  .status(200)
  .clearCookie("accessToken",options)
  .clearCookie('refreshToken',options)
  .json(new ApiResponse(200,{},'User Logged out'))
})

const refreshAccessToken = asyncHandler(async (req,res)=>{
  const incomingRefreshToken = req.cookies?.refreshToken || req.body.refreshToken;

  if(!incomingRefreshToken){
      throw new ApiErrors(401,'Unauthorized request');
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    )
    const user = await User.findById(decodedToken._id);
    
    if(!user){
      throw new ApiErrors(401,"Unauthorized request")
    }
  
    if(incomingRefreshToken !== user?.refreshToken){
      throw new ApiErrors(401,"refreshToken expired or used")
    }
  
    const options = {
      httpOnly:true,
      secure:true
    }
  
    const {accessToken,newRefreshToken} = await generateAccessAndRefreshTokens(user._id);
  
    res
    .status(200)
    .cookie('accessToken',accessToken)
    .cookie('refreshToken',newRefreshToken)
    .json(new ApiResponse(
      200,
    {
      accessToken,
      refreshToken : newRefreshToken 
    },
    "Access token refreshed"
  ))
  } catch (error) {
    throw new ApiErrors(401,error?.message || "something went wrong")
  }


})

export { 
  registerUser,
  loginUser,
  logoutUser, 
  refreshAccessToken,
};
