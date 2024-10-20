import path from "path";
import { fileURLToPath } from "url";
import { ApiResponse } from "../utils/ApiResponse.js";
import { displayError } from "../utils/displayFunctions.js";
import { Contact } from "../models/contact.model.js";

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
      res
        .status(200)
        .json(
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

function updateContact(req, res) {}

function deleteContact(req, res) {}

export { createContact, readContact, updateContact, deleteContact };
