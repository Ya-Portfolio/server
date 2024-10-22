import mongoose from "mongoose";
import { IndividualDocument } from "./individualDocument.model.js";

const achievementSchema = new mongoose.Schema({
  title: String,
  description: String,
  gallery: [{ type: mongoose.Schema.Types.ObjectId, ref: IndividualDocument }],
});

const Achievement = mongoose.model("achievements", achievementSchema);

export { Achievement };
