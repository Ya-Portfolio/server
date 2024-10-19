import { Router } from "express";
import multer from "multer";
import multerS3 from "multer-s3";
import { v4 as uuidv4 } from "uuid";
import { bucketName, s3 } from "../utils/aws.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { autheticateToken } from "../middlewares/auth.middleware.js";
import {
  createAchievement,
  deleteAchievement,
  readAchievement,
  updateAchievement,
} from "../controllers/achievement.controller.js";

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

router.route("/").get(readAchievement);

router.use(asyncHandler(autheticateToken));

router
  .route("/")
  .post(asyncHandler(createAchievement))
  .put(upload.single("image"), asyncHandler(updateAchievement))
  .delete(asyncHandler(deleteAchievement));

export default router;
