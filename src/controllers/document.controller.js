import path from "path";
import { fileURLToPath } from "url";
import { ApiResponse } from "../utils/ApiResponse.js";
import { displayError } from "../utils/displayFunctions.js";
import { IndividualDocument } from "../models/individualDocument.model.js";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { bucketName, s3 } from "../utils/aws.js";
import { Directory } from "../models/directory.model.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function uploadPrivateDocument(req, res) {
  const documentDetails = req.file;
  const directorySearchCondition = { name: "root" };

  const newDocumentData = {
    originalName: documentDetails.originalname,
    uuid: documentDetails.key,
    location: documentDetails.location,
  };

  IndividualDocument.create(newDocumentData)
    .then(async (documentData) => {
      const documentUpdateData = {
        $push: { documents: documentData._id },
      };
      await Directory.findOneAndUpdate(
        directorySearchCondition,
        documentUpdateData
      );
      res
        .status(201)
        .json(new ApiResponse(201, "Document added and is private", {}));
    })
    .catch(async (err) => {
      const input = {
        Bucket: bucketName,
        Key: documentDetails.key,
      };
      const command = new DeleteObjectCommand(input);
      await s3.send(command);
      const errorMessage = "Unable to add the document";
      displayError(errorMessage, __dirname, err);
      res.status(400).json(new ApiResponse(400, errorMessage, {}));
    });
}

function uploadPublicDocument(req, res) {
  const documentDetails = req.file;
  const directorySearchCondition = { name: "public" };

  const newDocumentData = {
    originalName: documentDetails.originalname,
    uuid: documentDetails.key,
    location: documentDetails.location,
  };

  IndividualDocument.create(newDocumentData)
    .then(async (documentData) => {
      const documentUpdateData = {
        $push: { documents: documentData._id },
      };
      await Directory.findOneAndUpdate(
        directorySearchCondition,
        documentUpdateData
      );
      res
        .status(201)
        .json(new ApiResponse(201, "Document added and is public", {}));
    })
    .catch(async (err) => {
      const input = {
        Bucket: bucketName,
        Key: documentDetails.key,
      };
      const command = new DeleteObjectCommand(input);
      await s3.send(command);
      const errorMessage = "Unable to add the document";
      displayError(errorMessage, __dirname, err);
      res.status(400).json(new ApiResponse(400, errorMessage, {}));
    });
}

function listPublicDocument(req, res) {
  const searchCondition = { name: "public" };
  const projectionObject = { __v: 0 };

  Directory.find(searchCondition, projectionObject)
    .populate("documents", projectionObject)
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

function listAllDocument(req, res) {
  const searchCondition = { name: { $in: ["root", "public"] } };
  const projectionObject = { __v: 0 };

  Directory.find(searchCondition, projectionObject)
    .populate("documents", projectionObject)
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

function deleteDocument(req, res) {
  const { type, _id } = req.body;

  IndividualDocument.findByIdAndDelete(_id)
    .then(async (documentDetails) => {
      const directorySearchCondition = { name: type };
      const directoryUpdateData = { $pull: { documents: _id } };
      const input = {
        Bucket: bucketName,
        Key: documentDetails.uuid,
      };
      const command = new DeleteObjectCommand(input);

      await Directory.findOneAndUpdate(
        directorySearchCondition,
        directoryUpdateData
      );
      await s3.send(command);
      res.status(200).json(new ApiResponse(200, "Deleted the document", {}));
    })
    .catch((err) => {
      const errorMessage = "Unable to delete the documents";
      displayError(errorMessage, __dirname, err);
      res.status(400).json(new ApiResponse(400, errorMessage, {}));
    });
}

export {
  uploadPrivateDocument,
  uploadPublicDocument,
  listPublicDocument,
  listAllDocument,
  deleteDocument,
};
