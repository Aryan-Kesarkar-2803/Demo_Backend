import { asyncHandler } from "../utils/asyncHandler.js";
import ApiErrors from "../utils/apiErrors.js";
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

  res.status(200).send();
});

export default registerUser;
