import path from "path";
import { fileURLToPath } from "url";
import { ApiResponse } from "../utils/ApiResponse.js";
import { displayError } from "../utils/displayFunctions.js";
import { Contact } from "../models/contact.model.js";
import { transporter } from "../utils/nodemailer.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function createContact(req, res) {
  const { email, name, message, wantGmeet, meetDate, meetTime } = req.body;
  const data = { email, name, message, wantGmeet, meetDate, meetTime };

  Contact.create(data)
    .then(() => {
      res.status(201).json(new ApiResponse(201, "Request submitted", {}));
    })
    .catch((err) => {
      const errorMessage = "Unable to submit the contact request";
      displayError(errorMessage, __dirname, err);
      res.status(400).json(new ApiResponse(400, errorMessage, {}));
    });
}

function readContact(req, res) {
  const searchCondition = { approved: false };
  const projectionObject = { __v: 0 };

  Contact.find(searchCondition, projectionObject)
    .then((result) => {
      res.status(200).json(
        new ApiResponse(200, "Retrieved the contact requests", {
          requests: result,
        })
      );
    })
    .catch((err) => {
      const errorMessage = "Unable to retrieve the contact requests";
      displayError(errorMessage, __dirname, err);
      res.status(400).json(new ApiResponse(400, errorMessage, {}));
    });
}

function updateContact(req, res) {
  const { _id, gmeetLink } = req.body;
  const updateData = { gmeetLink };

  Contact.findByIdAndUpdate(_id, updateData)
    .then(() => {
      res.status(200).json(new ApiResponse(200, "Add the meeting link", {}));
    })
    .catch((err) => {
      const errorMessage = "Unable to add the meeting link";
      displayError(errorMessage, __dirname, err);
      res.status(400).json(new ApiResponse(400, errorMessage, {}));
    });
}

function deleteContact(req, res) {
  const { _id } = req.body;

  Contact.findByIdAndDelete(_id)
    .then(() => {
      res
        .status(200)
        .json(new ApiResponse(200, "Deleted the contact request", {}));
    })
    .catch((err) => {
      const errorMessage = "Unable to delete the contact request";
      displayError(errorMessage, __dirname, err);
      res.status(400).json(new ApiResponse(400, errorMessage, {}));
    });
}

async function replyToMail(req, res) {
  const { email, mailSubject, mailBody } = req.body;
  const mailOptions = {
    to: email,
    subject: mailSubject,
    text: mailBody,
  };
  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json(new ApiResponse(200, "Sent the mail", {}));
  } catch (err) {
    const errorMessage = "Unable to send the mail";
    displayError(errorMessage, __dirname, err);
    res.status(400).json(new ApiResponse(400, errorMessage, {}));
  }
}

export { createContact, readContact, updateContact, deleteContact };
