import request from "supertest";
import app from "../src/app.js";
import { suite, test } from "mocha";
import mongoose from "mongoose";
import { config } from "dotenv";
import { expect } from "chai";
import { loadTest } from "loadtest";

config();

suite("Endpoint - /api/login/", () => {
  before(async () => {
    await mongoose.connect(`${process.env.MONGODB_URI}`);
  });

  test("Return a logintoken", async () => {
    await request(app)
      .post("/api/login")
      .then((res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an("object");
      })
      .catch((err) => {
        throw err;
      });
  });

  after(async () => {
    await mongoose.disconnect();
  });
});
