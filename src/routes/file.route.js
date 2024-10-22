import { Router } from "express";
import multer from "multer";
import multerS3 from "multer-s3";
import { v4 as uuidv4 } from "uuid";
import { bucketName, s3 } from "../utils/aws.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { autheticateToken } from "../middlewares/auth.middleware.js";
import {
  createFile,
  listFiles,
  listIndividualFile,
  updateFile,
  deleteFile,
  uploadCoverPhoto,
  deleteCoverPhoto,
  uploadGalleryPhoto,
  deleteGalleryPhoto,
} from "../controllers/file.controller.js";

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

router.route("/short-details").get(asyncHandler(listFiles));
router.route("/").get(asyncHandler(listIndividualFile));

router.use(asyncHandler(autheticateToken));

router
  .route("/")
  .post(asyncHandler(createFile))
  .put(asyncHandler(updateFile))
  .delete(asyncHandler(deleteFile));

router
  .route("/cover-photo")
  .post(upload.single("cover-photo"), asyncHandler(uploadCoverPhoto))
  .delete(asyncHandler(deleteCoverPhoto));
router
  .route("/gallery")
  .post(upload.array("gallery", 10), asyncHandler(uploadGalleryPhoto))
  .delete(asyncHandler(deleteGalleryPhoto));

export default router;
