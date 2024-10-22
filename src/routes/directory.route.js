import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  createDirectory,
  listDirectories,
  editDirectory,
  deleteDirectory,
} from "../controllers/directory.controller.js";

const router = Router();

router
  .route("/")
  .get(asyncHandler(listDirectories))
  .post(asyncHandler(createDirectory))
  .put(asyncHandler(editDirectory))
  .delete(asyncHandler(deleteDirectory));

export default router;
