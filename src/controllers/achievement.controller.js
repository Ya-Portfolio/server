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
    .populate("gallery", projectionObject)
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

function createAchievement(req, res) {
  const { title, description } = req.body;

  const data = { title, description, gallery: [] };

  Achievement.create(data)
    .then(() => {
      res.status(201).json(new ApiResponse(201, "Achievement created", {}));
    })
    .catch((err) => {
      const errorMessage = "Unable to create an achievement";
      displayError(errorMessage, __dirname, err);
      res.status(400).json(new ApiResponse(400, errorMessage, {}));
    });
}

function updateAchievement(req, res) {
  const imageDetails = req.file;
  const { _id: achievementObjectId } = req.body;

  const newImageData = {
    originalName: imageDetails.originalname,
    uuid: imageDetails.key,
    location: imageDetails.location,
  };

  IndividualDocument.create(newImageData)
    .then(async (imageData) => {
      const achievementUpdateData = {
        $push: { gallery: imageData._id },
      };
      await Achievement.findByIdAndUpdate(
        achievementObjectId,
        achievementUpdateData
      );
      res
        .status(201)
        .json(new ApiResponse(201, "Image added to achievement", {}));
    })
    .catch(async (err) => {
      const input = {
        Bucket: bucketName,
        Key: imageDetails.key,
      };
      const command = new DeleteObjectCommand(input);
      await s3.send(command);
      const errorMessage = "Unable to update the achievement";
      displayError(errorMessage, __dirname, err);
      res.status(400).json(new ApiResponse(400, errorMessage, {}));
    });
}

function deleteAchievement(req, res) {}

export {
  readAchievement,
  createAchievement,
  updateAchievement,
  deleteAchievement,
};
