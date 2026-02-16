const express = require("express");
const cors = require("cors");
const globalErrorHandler = require("./middleware/global-error-handler");
const routeNotFoundHandler = require("./middleware/route-not-found");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 8080;
// Configure allowed CORS origins via environment variable (comma-separated), defaulting to localhost for development
const allowedOrigins = (
  process.env.CORS_ALLOWED_ORIGINS || "http://localhost:3000"
)
  .split(",")
  .map((origin) => origin.trim())
  .filter((origin) => origin.length > 0);

// Middleware
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (e.g., mobile apps, curl) or if origin is explicitly allowed
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    origin: "http://localhost:3000",
    credentials: true,
  }),
);
app.use(express.json());

app.use("/api", require("./routes/index"));

app.get("/health", (req, res) => {
  res.status(200).json({ message: "Server is healthy" });
});

// keep these AFTER all routes, and in this order
app.use(routeNotFoundHandler);
app.use(globalErrorHandler);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
