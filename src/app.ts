import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import swaggerUi from "swagger-ui-express";

import { swaggerSpec } from "./config/swagger";
import { errorHandler } from "./middleware/error.middleware";

import authRoutes from "./routes/auth.routes";
import taskRoutes from "./routes/task.routes";
import timerRoutes from "./routes/timer.routes";
import goalRoutes from "./routes/goal.routes";
import targetRoutes from "./routes/target.routes";
import fitnessRoutes from "./routes/fitness.routes";
import noteRoutes from "./routes/note.routes";
import userRoutes from "./routes/user.routes";

const app = express();

const helmetMiddleware = helmet();
const allowedOrigins = (process.env.CLIENT_URL || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use((req, res, next) => {
  if (req.path.startsWith("/api/docs")) {
    return next();
  }

  return helmetMiddleware(req, res, next);
});

app.use(
  cors({
    origin:
      process.env.NODE_ENV === "development"
        ? true
        : allowedOrigins.length > 0
          ? allowedOrigins
          : false,
    credentials: true,
  }),
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.get("/api/docs.json", (req, res) => {
  res.json(swaggerSpec);
});

app.use(
  "/api/docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customCss: ".swagger-ui .topbar { background-color: #FF4D4D }",
    customSiteTitle: "alpha Life API Docs",
  }),
);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, message: "Too many requests, slow down." },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, message: "Too many auth attempts." },
});

app.use("/api", limiter);
app.use("/api/auth/login", authLimiter);
app.use("/api/auth/register", authLimiter);

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "alpha Life API is running",
    env: process.env.NODE_ENV,
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/timers", timerRoutes);
app.use("/api/goals", goalRoutes);
app.use("/api/targets", targetRoutes);
app.use("/api/fitness", fitnessRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/user", userRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

app.use(errorHandler);

export default app;
