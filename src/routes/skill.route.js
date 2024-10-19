import { Router } from "express";
import multer from "multer";
import multerS3 from "multer-s3";
import { v4 as uuidv4 } from "uuid";
import { config } from "dotenv";
import { s3 } from "../utils/aws.js";
import { autheticateToken } from "../middlewares/auth.middleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  createSkill,
  readSkill,
  updateSkill,
  deleteSkill,
} from "../controllers/skill.controller.js";

config();
const router = Router();

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_BUCKET_NAME,
    metadata: (req, file, cb) => {
      cb(null, { mimeType: file.mimetype });
    },
    key: (req, file, cb) => {
      cb(null, uuidv4());
    },
  }),
});

router.route("/").get(asyncHandler(readSkill));

router.use(asyncHandler(autheticateToken));

router
  .route("/")
  .post(asyncHandler(createSkill))
  .put(upload.single("image"), asyncHandler(updateSkill))
  .delete(asyncHandler(deleteSkill));

export default router;
