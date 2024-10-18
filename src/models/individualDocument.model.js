import mongoose from "mongoose";

const individualDocumentSchema = new mongoose.Schema({
  originalName: String,
  uuid: String,
});

const IndividualDocument = mongoose.model(
  "individualDocuments",
  individualDocumentSchema
);

export { IndividualDocument };
