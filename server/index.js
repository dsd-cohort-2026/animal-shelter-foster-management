const express = require("express");
const cors = require("cors");
const globalErrorHandler = require("./middleware/global-error-handler");
const routeNotFoundHandler = require("./middleware/route-not-found");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 8080;
const allowedOrigins = (process.env.CORS_ALLOWED_ORIGINS || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter((origin) => origin.length > 0);
const isProduction = process.env.NODE_ENV === "production";

function isLocalDevOrigin(origin) {
  try {
    const url = new URL(origin);
    return (
      (url.hostname === "localhost" || url.hostname === "127.0.0.1") &&
      (url.protocol === "http:" || url.protocol === "https:")
    );
  } catch {
    return false;
  }
}

// Middleware
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (e.g., mobile apps, curl) or if origin is explicitly allowed
      const isExplicitlyAllowed = allowedOrigins.includes(origin);
      const isAllowedLocalDevOrigin = !isProduction && isLocalDevOrigin(origin);

      if (!origin || isExplicitlyAllowed || isAllowedLocalDevOrigin) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
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
