import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import swaggerUi from "swagger-ui-express";
import { connectDB } from "./config/db";
import { swaggerSpec } from "./config/swagger";
import { errorHandler } from "./middleware/error.middleware";

// Routes
import authRoutes from "./routes/auth.routes";
import taskRoutes from "./routes/task.routes";
import timerRoutes from "./routes/timer.routes";
import goalRoutes from "./routes/goal.routes";
import targetRoutes from "./routes/target.routes";
import fitnessRoutes from "./routes/fitness.routes";
import noteRoutes from "./routes/note.routes";
import userRoutes from "./routes/user.routes";

const app = express();

// Connect DB
connectDB();

// Security
app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
    credentials: true,
  }),
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 100,
  message: { success: false, message: "Too many requests, slow down." },
});
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, message: "Too many auth attempts." },
});

app.use("/api/", limiter);
app.use("/api/auth/login", authLimiter);
app.use("/api/auth/register", authLimiter);

// Logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Body parsing
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Swagger docs
app.use(
  "/api/docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customCss: ".swagger-ui .topbar { background-color: #FF4D4D }",
    customSiteTitle: "alpha Life API Docs",
  }),
);

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "alpha Life API is running 🚀",
    env: process.env.NODE_ENV,
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/timers", timerRoutes);
app.use("/api/goals", goalRoutes);
app.use("/api/targets", targetRoutes);
app.use("/api/fitness", fitnessRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/user", userRoutes);

// 404
app.use("*", (req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(
    `🚀 Server running on port ${PORT} in ${process.env.NODE_ENV} mode`,
  );
  console.log(`📚 Swagger docs: http://localhost:${PORT}/api/docs`);
});

export default app;
