import mongoose from "mongoose";

const profileSchema = new mongoose.Schema({
  email: String,
  name: String,
  password: String,
  about: String,
  education: Array,
});

const Profile = mongoose.model("profiles", profileSchema);

export { Profile };
