import path from "path";
import { Profile } from "../models/profile.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { fileURLToPath } from "url";
import { displayError } from "../utils/displayFunctions.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function readProfileDetails(req, res) {
  const searchCondition = {};
  const projectionObject = { email: 0, _id: 0, __v: 0, password: 0 };

  Profile.findOne(searchCondition, projectionObject)
    .then((profileDetails) => {
      res
        .status(200)
        .json(new ApiResponse(200, "Get the profile details", profileDetails));
    })
    .catch((err) => {
      const errorMessage = "Unable to fetch the profile details";
      displayError(errorMessage, __dirname, err);
      res.status(400).json(new ApiResponse(400, errorMessage, {}));
    });
}

async function createProfileDetail(req, res) {}

async function updateProfileDetail(req, res) {
  // TODO - Get the email from the JWT token
  // const { email } = req.user;

  // TODO - Remove this email
  const email = "chandrababugowda3042003@gmail.com";

  const { about, education } = req.body;
  const searchCondition = { email };
  const updateData = { about, education };

  Profile.findOneAndUpdate(searchCondition, updateData)
    .then(() => {
      res.status(200).json(new ApiResponse(200, "Updated the profile", {}));
    })
    .catch((err) => {
      const errorMessage = "Unable to update the profile details";
      displayError(errorMessage, __dirname, err);
      res.status(400).json(new ApiResponse(400, errorMessage, {}));
    });
}

export { readProfileDetails, createProfileDetail, updateProfileDetail };
