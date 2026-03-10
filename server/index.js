const express = require("express");
const cors = require("cors");
const globalErrorHandler = require("./middleware/global-error-handler");
const routeNotFoundHandler = require("./middleware/route-not-found");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 8080;
const allowedOriginPatterns = (process.env.CORS_ALLOWED_ORIGINS || "")
  .split(",")
  .map((origin) => normalizeOrigin(origin.trim()))
  .filter((origin) => origin.length > 0);

function normalizeOrigin(origin) {
  return origin.replace(/\/+$/, "");
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function matchesOriginPattern(origin, pattern) {
  if (!pattern.includes("*")) {
    return origin === pattern;
  }

  const wildcardRegex = new RegExp(
    `^${pattern.split("*").map(escapeRegExp).join(".*")}$`,
  );
  return wildcardRegex.test(origin);
}

function isExplicitlyAllowedOrigin(origin) {
  return allowedOriginPatterns.some((pattern) =>
    matchesOriginPattern(origin, pattern),
  );
}

function isLocalDevOrigin(origin) {
  try {
    const url = new URL(normalizeOrigin(origin));
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
      const normalizedOrigin = normalizeOrigin(origin || "");

      // Allow requests with no origin (e.g., mobile apps, curl) or if origin is explicitly allowed
      const isExplicitlyAllowed =
        normalizedOrigin.length > 0 &&
        isExplicitlyAllowedOrigin(normalizedOrigin);
      const isAllowedLocalDevOrigin =
        normalizedOrigin.length > 0 && isLocalDevOrigin(normalizedOrigin);

      if (!origin || isExplicitlyAllowed || isAllowedLocalDevOrigin) {
        return callback(null, true);
      }
      return callback(new Error(`Not allowed by CORS: ${origin}`));
    },
    credentials: true,
  }),
);
app.use(express.json());

app.use("/api", require("./routes/index"));

app.get("/health", (req, res) => {
  res.status(200).json({ message: "Server is healthy" });
});

// Gets rid of route not found when browser requests favicon file
app.get('/favicon.ico', (req, res) => {
  res.status(204).end();
});

// keep these AFTER all routes, and in this order
app.use(routeNotFoundHandler);
app.use(globalErrorHandler);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
