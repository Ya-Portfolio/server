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

    jwt.verify(
      token,
      process.env.LOGIN_TOKEN_ACCESS_KEY,
      (err, userDetails) => {
        if (err) {
          return res
            .status(403)
            .json(new ApiResponse(403, "Access forbidden", {}));
        }
        req.user = userDetails;
        next();
      }
    );
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

function checkValidToken(token) {
  try {
    if (token === null || token === undefined) {
      return false;
    }
    jwt.verify(
      token,
      process.env.LOGIN_TOKEN_ACCESS_KEY,
      (err, userDetails) => {
        if (err) {
          return false;
        }
      }
    );
    return true;
  } catch (error) {
    console.log(
      new ApiError(
        500,
        "Unable to authenticate token",
        "authenticateToken",
        error
      )
    );
    return false;
  }
}

// async function checkValidToken(req, res) {
//   try {
//     const token = req.cookies.loginToken;
//     if (token === null) {
//       res.status(400).json(new ApiResponse(400, "Unauthorized", {}));
//       return false;
//     }
//     jwt.verify(
//       token,
//       process.env.LOGIN_TOKEN_ACCESS_KEY,
//       (err, userDetails) => {
//         if (err) {
//           res.status(403).json(new ApiResponse(403, "Access forbidden", {}));
//           return false;
//         }
//         console.log("after return");
//         req.user = userDetails;
//         return true;
//       }
//     );
//   } catch (error) {
//     console.log(
//       new ApiError(
//         500,
//         "Unable to authenticate token",
//         "authenticateToken",
//         error
//       )
//     );
//   }
// }

export { autheticateToken, checkValidToken };
