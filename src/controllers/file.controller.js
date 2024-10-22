import path from "path";
import { fileURLToPath } from "url";
import { ApiResponse } from "../utils/ApiResponse.js";
import { displayError } from "../utils/displayFunctions.js";
import { IndividualDocument } from "../models/individualDocument.model.js";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { bucketName, s3 } from "../utils/aws.js";
import { Directory } from "../models/directory.model.js";
import { checkValidToken } from "../middlewares/auth.middleware.js";
import { File } from "../models/file.model.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function createFile(req, res) {
  const { type } = req.body;
  const fileData = { type };

  File.create(fileData)
    .then((result) => {
      res
        .status(201)
        .json(new ApiResponse(201, "File created", { _id: result._id }));
    })
    .catch((err) => {
      const errorMessage = "Unable to create the file";
      displayError(errorMessage, __dirname, err);
      res.status(400).json(new ApiResponse(400, errorMessage, {}));
    });
}

function listFiles(req, res) {
  const { type } = req.query;
  const searchCondition = { type };
  const projectionObject = { title: 1, date: 1 };

  File.find(searchCondition, projectionObject)
    .then((files) => {
      res
        .status(200)
        .json(new ApiResponse(200, "Fetched the files", { files }));
    })
    .catch((err) => {
      const errorMessage = "Unable to fetch the file";
      displayError(errorMessage, __dirname, err);
      res.status(400).json(new ApiResponse(400, errorMessage, {}));
    });
}

function listIndividualFile(req, res) {
  const { _id } = req.query;

  File.findById(_id)
    .populate(["coverPhoto", "gallery"])
    .then((file) => {
      res.status(200).json(new ApiResponse(200, "Fetched the files", { file }));
    })
    .catch((err) => {
      const errorMessage = "Unable to fetch the file";
      displayError(errorMessage, __dirname, err);
      res.status(400).json(new ApiResponse(400, errorMessage, {}));
    });
}

function updateFile(req, res) {
  const { _id, type, title, tags, date, content } = req.body;
  const updateData = { type, title, tags, date: new Date(), content };

  File.findByIdAndUpdate(_id, updateData)
    .then(() => {
      res.status(200).json(new ApiResponse(200, "Updated the file", {}));
    })
    .catch((err) => {
      const errorMessage = "Unable to upload the file";
      displayError(errorMessage, __dirname, err);
      res.status(400).json(new ApiResponse(400, errorMessage, {}));
    });
}

function deleteFile(req, res) {
  const { _id } = req.query;

  File.findByIdAndDelete(_id)
    .then(() => {
      res.status(200).json(new ApiResponse(200, "Deleted the file", {}));
    })
    .catch((err) => {
      const errorMessage = "Unable to delete the file";
      displayError(errorMessage, __dirname, err);
      res.status(400).json(new ApiResponse(400, errorMessage, {}));
    });
}

function uploadCoverPhoto(req, res) {
  const { _id } = req.body;
  const imageDetails = req.file;

  const newImageData = {
    originalName: imageDetails.originalname,
    uuid: imageDetails.key,
    location: imageDetails.location,
  };

  IndividualDocument.create(newImageData)
    .then(async (imageData) => {
      const fileUpdateData = {
        coverPhoto: imageData._id,
      };
      await File.findByIdAndUpdate(_id, fileUpdateData);
      res.status(201).json(new ApiResponse(201, "Cover photo added", {}));
    })
    .catch(async (err) => {
      const input = {
        Bucket: bucketName,
        Key: imageDetails.key,
      };
      const command = new DeleteObjectCommand(input);
      await s3.send(command);
      const errorMessage = "Unable to add the cover photo";
      displayError(errorMessage, __dirname, err);
      return res.status(400).json(new ApiResponse(400, errorMessage, {}));
    });
}

function deleteCoverPhoto(req, res) {
  const { imageId, fileId } = req.query;

  if (!checkValidToken(req.cookies.loginToken)) {
    return res.status(403).json(new ApiResponse(403, "Unauthorized", {}));
  }

  IndividualDocument.findByIdAndDelete(imageId)
    .then(async (imageDetails) => {
      const fileUpdateData = { coverPhoto: null };
      const input = {
        Bucket: bucketName,
        Key: imageDetails.uuid,
      };
      const command = new DeleteObjectCommand(input);
      await File.findByIdAndUpdate(fileId, fileUpdateData);
      await s3.send(command);
      res.status(200).json(new ApiResponse(200, "Deleted the cover-photo", {}));
    })
    .catch((err) => {
      const errorMessage = "Unable to remove the cover photo";
      displayError(errorMessage, __dirname, err);
      res.status(400).json(new ApiResponse(400, errorMessage, {}));
    });
}

async function uploadGalleryPhoto(req, res) {
  const imageDetails = req.files;
  const { _id } = req.body;

  const galleryPromises = imageDetails.map(async (imageDetail) => {
    const newImageData = {
      originalName: imageDetail.originalname,
      uuid: imageDetail.key,
      location: imageDetail.location,
    };

    try {
      const imageData = await IndividualDocument.create(newImageData);
      return imageData._id;
    } catch (err) {
      const input = {
        Bucket: bucketName,
        Key: imageDetails.key,
      };
      const command = new DeleteObjectCommand(input);
      await s3.send(command);
      const errorMessage = "Unable to add the cover photo";
      displayError(errorMessage, __dirname, err);
      return res.status(400).json(new ApiResponse(400, errorMessage, {}));
    }
  });

  const gallery = await Promise.all(galleryPromises);

  const fileUpdateData = {
    $push: { gallery },
  };

  await File.findByIdAndUpdate(_id, fileUpdateData);
  res.status(200).json(new ApiResponse(200, "Upload the images", {}));
}

function deleteGalleryPhoto(req, res) {
  const { imageId, fileId } = req.query;

  IndividualDocument.findByIdAndDelete(imageId)
    .then(async (imageData) => {
      const updateData = { $pull: { gallery: imageData._id } };
      await File.findByIdAndUpdate(fileId, updateData);
      res.status(200).json(new ApiResponse(200, "Photo deleted", {}));
    })
    .catch(async (err) => {
      const input = {
        Bucket: bucketName,
        Key: imageDetails.key,
      };
      const command = new DeleteObjectCommand(input);
      await s3.send(command);
      const errorMessage = "Unable to add the cover photo";
      displayError(errorMessage, __dirname, err);
      return res.status(400).json(new ApiResponse(400, errorMessage, {}));
    });
}

export {
  createFile,
  listFiles,
  listIndividualFile,
  updateFile,
  deleteFile,
  uploadCoverPhoto,
  deleteCoverPhoto,
  uploadGalleryPhoto,
  deleteGalleryPhoto,
};
