import mongoose from "mongoose";

const profileSchema = new mongoose.Schema({
  email: { type: String, require: true, unique: true },
  name: String,
  password: String,
  about: String,
  education: Array,
});

const Profile = mongoose.model("profiles", profileSchema);

export { Profile };
