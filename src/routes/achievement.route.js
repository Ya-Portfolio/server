import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { autheticateToken } from "../middlewares/auth.middleware.js";
import {
  createAchievement,
  deleteAchievement,
  readAchievement,
  updateAchievement,
} from "../controllers/achievement.controller.js";

const router = Router();

router.route("/").get(readAchievement);

router.use(asyncHandler(autheticateToken));

router
  .route("/")
  .post(asyncHandler(createAchievement))
  .put(asyncHandler(updateAchievement))
  .delete(asyncHandler(deleteAchievement));

export default router;
