import mongoose from "mongoose";

const contactSchema = new mongoose.Schema({
  email: { type: String, require: true },
  name: { type: String, require: true },
  message: String,
  wantGmeet: Boolean,
  meetDate: Date,
  meetTime: String,
  gmeetLink: String,
});

const Contact = new mongoose.model("contacts", contactSchema);

export { Contact };
