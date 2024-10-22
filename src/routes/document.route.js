import { Router } from "express";
import multer from "multer";
import multerS3 from "multer-s3";
import { v4 as uuidv4 } from "uuid";
import { bucketName, s3 } from "../utils/aws.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  uploadDocument,
  listDocuments,
  deleteDocument,
} from "../controllers/document.controller.js";

const router = Router();

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: bucketName,
    metadata: (req, file, cb) => {
      cb(null, { mimeType: file.mimetype });
    },
    key: (req, file, cb) => {
      cb(null, uuidv4());
    },
  }),
});

router
  .route("/")
  .get(asyncHandler(listDocuments))
  .post(upload.single("document"), asyncHandler(uploadDocument))
  .delete(asyncHandler(deleteDocument));

export default router;
