import path from "path";
import { fileURLToPath } from "url";
import { Skill } from "../models/skill.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { displayError } from "../utils/displayFunctions.js";
import { IndividualDocument } from "../models/individualDocument.model.js";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { bucketName, s3 } from "../utils/aws.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function readSkill(req, res) {
  const searchCondition = {};
  const projectionObject = { __v: 0 };

  Skill.find(searchCondition, projectionObject)
    .populate("gallery", { __v: 0 })
    .then((result) => {
      res
        .status(200)
        .json(new ApiResponse(200, "Fetched the skills", { skills: result }));
    })
    .catch((err) => {
      const errorMessage = "Unable to fetch the skilld";
      displayError(errorMessage, __dirname, err);
      res.status(400).json(new ApiResponse(400, errorMessage, {}));
    });
}

function createSkill(req, res) {
  const { name } = req.body;

  const data = { name, gallery: [] };

  Skill.create(data)
    .then(() => {
      res.status(201).json(new ApiResponse(201, "Skill created", {}));
    })
    .catch((err) => {
      const errorMessage = "Unable to create a skill";
      displayError(errorMessage, __dirname, err);
      res.status(400).json(new ApiResponse(400, errorMessage, {}));
    });
}

function updateSkill(req, res) {
  const imageDetails = req.file;
  const { _id: skillObjectId } = req.body;

  const newImageData = {
    originalName: imageDetails.originalname,
    uuid: imageDetails.key,
    location: imageDetails.location,
  };

  IndividualDocument.create(newImageData)
    .then(async (imageData) => {
      const skillUpdateData = {
        $push: { gallery: imageData._id },
      };
      await Skill.findByIdAndUpdate(skillObjectId, skillUpdateData);
      res.status(201).json(new ApiResponse(201, "Image added to skill", {}));
    })
    .catch(async (err) => {
      const input = {
        Bucket: bucketName,
        Key: imageDetails.key,
      };
      const command = new DeleteObjectCommand(input);
      await s3.send(command);
      const errorMessage = "Unable to update the skill";
      displayError(errorMessage, __dirname, err);
      res.status(400).json(new ApiResponse(400, errorMessage, {}));
    });
}

function deleteSkill(req, res) {
  const { ObjectId } = req.body;

  Skill.findByIdAndDelete(ObjectId)
    .then((response) => {
      response.gallery.forEach(async (image) => {
        const imageDetails = await IndividualDocument.findByIdAndDelete(image);
        const input = {
          Bucket: bucketName,
          Key: imageDetails.uuid,
        };
        const command = new DeleteObjectCommand(input);
        await s3.send(command);
      });

      res.status(200).json(new ApiResponse(200, "Deleted the skill", {}));
    })
    .catch((err) => {
      const errorMessage = "Unable to delete the skill";
      displayError(errorMessage, __dirname, err);
      res.status(400).json(new ApiResponse(400, errorMessage, {}));
    });
}

export { createSkill, readSkill, updateSkill, deleteSkill };
