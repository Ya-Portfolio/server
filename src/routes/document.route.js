import { Router } from "express";
import multer from "multer";
import multerS3 from "multer-s3";
import { v4 as uuidv4 } from "uuid";
import { bucketName, s3 } from "../utils/aws.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { autheticateToken } from "../middlewares/auth.middleware.js";
import {
  uploadPrivateDocument,
  uploadPublicDocument,
  listPublicDocument,
  listAllDocument,
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
  .route("/public")
  .get(asyncHandler(listPublicDocument))
  .post(upload.single("document"), asyncHandler(uploadPublicDocument));

router.use(asyncHandler(autheticateToken));

router
  .route("/")
  .get(asyncHandler(listAllDocument))
  .post(upload.single("document"), asyncHandler(uploadPrivateDocument))
  .delete(asyncHandler(deleteDocument));

export default router;
