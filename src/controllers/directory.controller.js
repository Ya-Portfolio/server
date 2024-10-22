import path from "path";
import { fileURLToPath } from "url";
import { ApiResponse } from "../utils/ApiResponse.js";
import { displayError } from "../utils/displayFunctions.js";
import { IndividualDocument } from "../models/individualDocument.model.js";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { bucketName, s3 } from "../utils/aws.js";
import { Directory } from "../models/directory.model.js";
import { checkValidToken } from "../middlewares/auth.middleware.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function createDirectory(req, res) {
  const { name, isPrivate } = req.body;
  const createData = { name, isPrivate };

  if (isPrivate) {
    if (!checkValidToken(req.cookies.loginToken)) {
      return res.status(400).json(new ApiResponse(400, "Unauthorized", {}));
    }
  }

  Directory.create(createData)
    .then(() => {
      res.status(201).json(new ApiResponse(201, "Directory created", {}));
    })
    .catch((err) => {
      const errorMessage = "Unable to create directory";
      displayError(errorMessage, __dirname, err);
      res.status(400).json(new ApiResponse(400, errorMessage, {}));
    });
}

function listDirectories(req, res) {
  let searchCondition = { isPrivate: false };
  const projectionObject = { isPrivate: 0, __v: 0 };

  if (checkValidToken(req.cookies.loginToken)) searchCondition = {};

  Directory.find(searchCondition, projectionObject)
    .lean()
    .then((result) => {
      res
        .status(200)
        .json(
          new ApiResponse(200, "Fetched the documents", { documents: result })
        );
    })
    .catch((err) => {
      const errorMessage = "Unable to fetch the documents";
      displayError(errorMessage, __dirname, err);
      res.status(400).json(new ApiResponse(400, errorMessage, {}));
    });
}

async function editDirectory(req, res) {
  const { _id, name, isPrivate } = req.body;
  let updateData = { name };

  const isPrivateDirectory = await Directory.findById(_id).lean();
  console.log(isPrivateDirectory.isPrivate);

  if (isPrivateDirectory.isPrivate) {
    if (checkValidToken(req.cookies.loginToken)) {
      updateData = { name, isPrivate };
    } else {
      return res.status(400).json(new ApiResponse(400, "Unauthorized", {}));
    }
  }

  Directory.findByIdAndUpdate(_id, updateData)
    .then(() => {
      res.status(200).json(new ApiResponse(200, "Updated directory details"));
    })
    .catch((err) => {
      const errorMessage = "Unable to fetch the documents";
      displayError(errorMessage, __dirname, err);
      res.status(400).json(new ApiResponse(400, errorMessage, {}));
    });
}

function deleteDirectory(req, res) {
  const { _id } = req.query;
  if (!checkValidToken(req, res)) {
    return res.status(400).json(new ApiResponse(400, "Unauthorized", {}));
  }

  Directory.findByIdAndDelete(_id)
    .then((deletedDirectory) => {
      deletedDirectory.documents.forEach(async (documentId) => {
        const deletedIndividualDocument =
          await IndividualDocument.findByIdAndDelete(documentId);
        const input = {
          Bucket: bucketName,
          Key: deletedIndividualDocument.uuid,
        };
        const command = new DeleteObjectCommand(input);
        await s3.send(command);
      });
    })
    .catch((err) => {
      const errorMessage = "Unable to delete the directory";
      displayError(errorMessage, __dirname, err);
      res.status(400).json(new ApiResponse(400, errorMessage, {}));
    });
}

export { createDirectory, listDirectories, editDirectory, deleteDirectory };
