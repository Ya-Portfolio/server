import path from "path";
import { fileURLToPath } from "url";
import { ApiResponse } from "../utils/ApiResponse.js";
import { displayError } from "../utils/displayFunctions.js";
import { Achievement } from "../models/achievement.model.js";
import { IndividualDocument } from "../models/individualDocument.model.js";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { bucketName, s3 } from "../utils/aws.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function readAchievement(req, res) {
  const searchCondition = {};
  const projectionObject = { __v: 0 };

  Achievement.find(searchCondition, projectionObject)
    .populate("files", projectionObject)
    .then((result) => {
      res.status(200).json(
        new ApiResponse(200, "Fetched the achievements", {
          achievements: result,
        })
      );
    })
    .catch((err) => {
      const errorMessage = "Unable to fetch the achievements";
      displayError(errorMessage, __dirname, err);
      res.status(400).json(new ApiResponse(400, errorMessage, {}));
    });
}

function createAchievement(req, res) {}

function updateAchievement(req, res) {}

function deleteAchievement(req, res) {}

export {
  readAchievement,
  createAchievement,
  updateAchievement,
  deleteAchievement,
};
