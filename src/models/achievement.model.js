import mongoose from "mongoose";
import { IndividualDocument } from "./individualDocument.model.js";

const achievementSchema = new mongoose.Schema({
  title: { type: String, require: true },
  description: String,
  file: { type: mongoose.Schema.Types.ObjectId, ref: "IndividualDocument" },
});

const Achievement = mongoose.model("achievements", achievementSchema);

export { Achievement };
