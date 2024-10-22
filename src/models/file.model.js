import mongoose from "mongoose";
import { IndividualDocument } from "./individualDocument.model.js";

const fileSchema = new mongoose.Schema({
  type: { type: String, require: true },
  title: String,
  date: { type: Date, default: Date.now },
  content: String,
  tags: [String],
  coverPhoto: { type: mongoose.Schema.Types.ObjectId, ref: IndividualDocument },
  gallery: [{ type: mongoose.Schema.Types.ObjectId, ref: IndividualDocument }],
});

const File = mongoose.model("files", fileSchema);

export { File };
