import ApiErrors from "../utils/apiErrors.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from 'jsonwebtoken'
import { User } from "../models/user.models.js";

export const verifyJwt = asyncHandler(async (req,res,next)=>{
    try {
        const token = req.cookies?.accessToken || req.header('Authorization')?.replace('Bearer ','');
       
        if(!token){
            throw new ApiErrors(404,'Unauthorized User')
        }
    
        const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
        console.log('decoded token - ',decodedToken);
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
        
        if(!user){
            throw new ApiErrors(401,"invalid access token")
        }

        req.user = user;

        next();
    } 
    catch (error) {
        throw new ApiErrors(401,error?.message || "Invalid Access token")
    }
})