import mongoose from "mongoose";

const contactSchema = new mongoose.Schema({
  email: { type: String, require: true },
  name: { type: String, require: true },
  message: String,
  wantGmeet: { type: Boolean, default: false },
  meetDate: { type: Date, default: null },
  meetTime: { type: String, default: null },
  approved: { type: Boolean, default: false },
  gmeetLink: String,
});

const Contact = new mongoose.model("contacts", contactSchema);

export { Contact };
