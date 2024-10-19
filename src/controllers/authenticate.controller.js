import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { config } from "dotenv";
import { Profile } from "../models/profile.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { transporter } from "../utils/nodemailer.js";
import { displayError } from "../utils/displayFunctions.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

config();

async function initialSetup(req, res) {
  const { email, name, password, about } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  const createData = {
    email,
    name,
    password: hashedPassword,
    about,
    education: [],
  };

  Profile.create(createData)
    .then(() => {
      res.status(201).json(new ApiResponse(201, "User created", {}));
    })
    .catch((err) => {
      const errorMessage = "Unable to create user";
      displayError(errorMessage, __dirname, err);
      res.status(400).json(new ApiResponse(400, errorMessage, {}));
    });
}

async function login(req, res) {
  const { password } = req.body;
  const searchCondition = {};

  Profile.findOne(searchCondition)
    .then(async (user) => {
      const isPasswordCorrect = await bcrypt.compare(password, user.password);

      if (isPasswordCorrect) {
        const loginTokenPayload = {
          email: user.email,
          user: "admin",
        };

        const signOptions = {
          expiresIn: process.env.LOGIN_TOKEN_EXPIRY,
        };

        const loginToken = jwt.sign(
          loginTokenPayload,
          process.env.TOKEN_ACCESS_KEY,
          signOptions
        );

        res.cookie("loginToken", loginToken, { httpOnly: true });

        res.status(200).json(
          new ApiResponse(200, "User logged in", {
            loginToken,
          })
        );
      } else {
        res.status(400).json(new ApiResponse(400, "Invalid credentials", {}));
      }
    })
    .catch((err) => {
      const errorMessage = "Unable to login";
      displayError(errorMessage, __dirname, err);
      res.status(400).json(new ApiResponse(400, errorMessage, {}));
    });
}

async function resetPassword(req, res) {
  const { password } = req.body;

  const searchCondition = {};
  const profileUpdateData = {
    password: await bcrypt.hash(password, 10),
  };

  Profile.findOneAndUpdate(searchCondition, profileUpdateData)
    .then(async () => {
      res
        .status(200)
        .json(new ApiResponse(200, "Password reset successful", {}));
    })
    .catch((err) => {
      const errorMessage = "Unable to login";
      displayError(errorMessage, __dirname, err);
      res.status(400).json(new ApiResponse(400, errorMessage, {}));
    });
}

async function logout(req, res) {
  res.clearCookie("loginToken");
  res.status(200).json(new ApiResponse(200, "Logged out", {}));
}

export { initialSetup, login, resetPassword, logout };
