import app from "./app";
import { connectDB } from "./config/db";

const PORT: number = parseInt(process.env.PORT || "8080", 10);

const startServer = async () => {
  await connectDB();

  app.listen(PORT, "0.0.0.0", () => {
    console.log(
      `Server running on 0.0.0.0:${PORT} in ${process.env.NODE_ENV} mode`,
    );
  });
};

startServer().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
