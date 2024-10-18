import mongoose from "mongoose";
import { IndividualDocument } from "./individualDocument.model";

const directorySchema = new mongoose.Schema({
  name: { type: String, require: true },
  documents: [
    { type: mongoose.Schema.Types.ObjectId, ref: IndividualDocument },
  ],
});

const Directory = mongoose.model("directories", directorySchema);

export { Directory };
