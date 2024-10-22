import mongoose from "mongoose";
import { IndividualDocument } from "./individualDocument.model.js";

const skillSchema = new mongoose.Schema({
  name: String,
  gallery: [{ type: mongoose.Schema.Types.ObjectId, ref: IndividualDocument }],
});

const Skill = mongoose.model("skills", skillSchema);

export { Skill };
