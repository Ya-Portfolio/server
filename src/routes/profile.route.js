import { Router } from "express";
import { autheticateToken } from "../middlewares/auth.middleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { readProfileDetails } from "../controllers/profile.controller.js";

const router = Router();

router.route("/").get(asyncHandler(readProfileDetails));

router.use(asyncHandler(autheticateToken));

router.route("/").post().put().delete();

export default router;
