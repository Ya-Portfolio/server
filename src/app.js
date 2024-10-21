import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import profileRouter from "./routes/profile.route.js";
import loginRouter from "./routes/authenticate.route.js";
import skillRouter from "./routes/skill.route.js";
import achievementRouter from "./routes/achievement.route.js";
import contactRouter from "./routes/contact.route.js";
import documentRouter from "./routes/document.route.js";

const app = express();

app.use(cors({ origin: "*", credentials: true }));
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

app.use("/api/authenticate", loginRouter);
app.use("/api/profile", profileRouter);
app.use("/api/skill", skillRouter);
app.use("/api/achievement", achievementRouter);
app.use("/api/contact", contactRouter);
app.use("/api/document", documentRouter);

export default app;
