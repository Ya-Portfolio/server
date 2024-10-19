import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { autheticateToken } from "../middlewares/auth.middleware";
import {
  createAchievement,
  deleteAchievement,
  readAchievement,
  updateAchievement,
} from "../controllers/achievement.controller";

const router = Router();

router.route("/").get(readAchievement);

router.use(asyncHandler(autheticateToken));

router
  .route("/")
  .post(asyncHandler(createAchievement))
  .put(asyncHandler(updateAchievement))
  .delete(asyncHandler(deleteAchievement));

export default router;
