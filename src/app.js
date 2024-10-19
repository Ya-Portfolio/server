import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import profileRouter from "./routes/profile.route.js";
import loginRouter from "./routes/authenticate.route.js";

const app = express();

app.use(cors({ origin: "*", credentials: true }));
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

app.use("/api/authenticate", loginRouter);
app.use("/api/profile", profileRouter);

export default app;
