import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({
  originalName: String,
  uuid: String,
});

const achievementSchema = new mongoose.Schema({
  title: { type: String, require: true },
  description: String,
  file: fileSchema,
});

const Achievement = mongoose.model("achievements", achievementSchema);

export { Achievement };
