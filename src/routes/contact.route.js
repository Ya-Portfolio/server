import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { autheticateToken } from "../middlewares/auth.middleware.js";
import {
  createContact,
  readContact,
  updateContact,
  deleteContact,
} from "../controllers/contact.controller";

const router = Router();

router.route("/").post(asyncHandler(createContact));

router.use(asyncHandler(autheticateToken));

router
  .route("/")
  .get(asyncHandler(readContact))
  .put(asyncHandler(updateContact))
  .delete(asyncHandler(deleteContact));

export default router;
