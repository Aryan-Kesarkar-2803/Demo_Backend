import { asyncHandler } from "../utils/asyncHandler.js";

const registerUser = asyncHandler(async (req, res) => {
    console.log(req.body);
  res.status(200).send();
});


export default registerUser;
