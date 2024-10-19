import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  login,
  resetPassword,
  logout,
  initialSetup,
} from "../controllers/authenticate.controller.js";

const router = Router();

router.route("/").post(asyncHandler(login)).delete(asyncHandler(logout));

router.route("/setup").post(asyncHandler(initialSetup));

router.route("/reset").post(asyncHandler(resetPassword));

export default router;
