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

function uploadDocument(req, res) {
  const documentDetails = req.file;
  const { _id } = req.body;

  const newDocumentData = {
    originalName: documentDetails.originalname,
    uuid: documentDetails.key,
    location: documentDetails.location,
  };

  IndividualDocument.create(newDocumentData)
    .then(async (documentData) => {
      const directoryUpdateData = {
        $push: { documents: documentData._id },
      };
      const isPrivateDirectory = await Directory.findById(_id).lean();

      if (isPrivateDirectory.isPrivate) {
        if (!checkValidToken(req.cookies.loginToken)) {
          return Promise.reject(
            new ApiResponse(400, "Unauthorized", {
              documentId: documentData._id,
            })
          );
        }
      }
      await Directory.findByIdAndUpdate(_id, directoryUpdateData);
      res.status(201).json(new ApiResponse(201, "Document added", {}));
    })
    .catch(async (err) => {
      if (err instanceof ApiResponse && err.statusCode === 400) {
        const input = {
          Bucket: bucketName,
          Key: documentDetails.key,
        };
        const command = new DeleteObjectCommand(input);
        await s3.send(command);
        await IndividualDocument.findByIdAndDelete(err.data.documentId);
        const errorMessage = "Unable to add the document";
        displayError(errorMessage, __dirname, err);
        return res.status(400).json(err);
      }
    });
}

async function listDocuments(req, res) {
  const { _id } = req.query;

  const isPrivateDirectory = await Directory.findById(_id).lean();

  if (isPrivateDirectory.isPrivate) {
    if (!checkValidToken(req.cookies.loginToken)) {
      return res.status(403).json(new ApiResponse(403, "Unauthorized", {}));
    }
  }
  Directory.findById(_id)
    .populate("documents")
    .then((result) => {
      res.status(200).json(
        new ApiResponse(201, "Listed files from the directory", {
          files: result,
        })
      );
    })
    .catch((err) => {
      const errorMessage = "Unable to list the documents";
      displayError(errorMessage, __dirname, err);
      res.status(400).json(new ApiResponse(400, errorMessage, {}));
    });
}

function deleteDocument(req, res) {
  const { documentId, directoryId } = req.query;

  if (!checkValidToken(req.cookies.loginToken)) {
    return res.status(403).json(new ApiResponse(403, "Unauthorized", {}));
  }

  IndividualDocument.findByIdAndDelete(documentId)
    .then(async (documentDetails) => {
      const directoryUpdateData = { $pull: { documents: documentDetails._id } };
      const input = {
        Bucket: bucketName,
        Key: documentDetails.uuid,
      };
      const command = new DeleteObjectCommand(input);
      await Directory.findByIdAndUpdate(directoryId, directoryUpdateData);
      await s3.send(command);
      res.status(200).json(new ApiResponse(200, "Deleted the document", {}));
    })
    .catch((err) => {
      const errorMessage = "Unable to delete the document";
      displayError(errorMessage, __dirname, err);
      res.status(400).json(new ApiResponse(400, errorMessage, {}));
    });
}

export { uploadDocument, listDocuments, deleteDocument };
