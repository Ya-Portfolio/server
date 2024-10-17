import request from "supertest";
import app from "../src/app.js";
import { suite, test } from "mocha";
import mongoose from "mongoose";
import { config } from "dotenv";
import { expect } from "chai";
import { loadTest } from "loadtest";

config();

suite("GET /api/profile", () => {
  before(async () => {
    await mongoose.connect(`${process.env.MONGODB_URI}`);
  });

  test("Return an object with name, about and education details", async () => {
    await request(app)
      .get("/api/profile")
      .then((res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an("object");
        expect(res.body.data).to.have.key("name", "about", "education");
      })
      .catch((err) => {
        throw err;
      });
  });

  after(async () => {
    await mongoose.disconnect();
  });
});
