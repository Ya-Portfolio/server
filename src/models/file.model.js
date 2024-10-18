import mongoose from "mongoose";
import { IndividualDocument } from "./individualDocument.model";

const fileSchema = new mongoose.Schema({
  type: { type: String, require: true },
  title: { type: String, require: true },
  date: { type: Date, default: Date.now },
  content: [Object],
  tags: [String],
  gallery: [{ type: mongoose.Schema.Types.ObjectId, ref: IndividualDocument }],
});

const File = mongoose.model("files", fileSchema);

export { File };
