import mongoose from "mongoose";

const individualDocumentSchema = new mongoose.Schema({
  originalName: { type: String, require: true },
  uuid: { type: String, require: true },
  location: { type: String, require: true },
});

const IndividualDocument = mongoose.model(
  "individualDocuments",
  individualDocumentSchema
);

export { IndividualDocument };
