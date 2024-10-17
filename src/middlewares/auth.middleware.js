import jwt from "jsonwebtoken";
import { config } from "dotenv";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

config();

async function autheticateToken(req, res, next) {
  try {
    const token = req.cookies.loginToken;

    if (token === null) {
      res.status(400).json(new ApiResponse(400, "Unauthorized", {}));
    }

    jwt.verify(token, process.env.TOKEN_ACCESS_KEY, (err, userDetails) => {
      if (err) {
        res.status(403).json(new ApiResponse(403, "Access forbidden", {}));
      }
      req.user = userDetails;
      next();
    });
  } catch (error) {
    console.log(
      new ApiError(
        500,
        "Unable to authenticate token",
        "authenticateToken",
        error
      )
    );
  }
}

export { autheticateToken };
