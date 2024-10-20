import { Router } from "express";
import { autheticateToken } from "../middlewares/auth.middleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  readProfileDetails,
  updateProfileDetail,
} from "../controllers/profile.controller.js";

const router = Router();

router.route("/").get(asyncHandler(readProfileDetails));

router.use(asyncHandler(autheticateToken));

router.route("/").put(asyncHandler(updateProfileDetail));

export default router;
