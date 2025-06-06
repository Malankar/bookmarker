import "./integrations/instrument.js";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import bookmarkRoutes from "./routes/bookmarkRoutes.js";
import errorHandler from "./middleware/errorHandler.js";
import { rateLimiter } from "./middleware/rateLimiter.js";
import authPkg from "express-openid-connect";
const { auth, requiresAuth } = authPkg;
import { authHandler } from "./middleware/authHandler.js";
import YAML from "yaml";
import swaggerUi from "swagger-ui-express";
import { readFileSync } from "fs";
import { authConfig } from "./config/authConfig.js";
import authRoutes from "./routes/authRoutes.js";
import helmet from "helmet";

const app = express();
const port = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        imgSrc: ["'self'", "https://robohash.org"],
      },
    },
  })
);

app.use(auth(authConfig));

app.use(express.static(path.join(__dirname, "public")));

// Serve the index.html file
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.use("/", authRoutes);

// Serve the profile.html file
app.get("/profile", requiresAuth(), (req, res) => {
  res.sendFile(path.join(__dirname, "public", "profile.html"));
});

// Use the bookmark routes
app.use("/v1", rateLimiter, bookmarkRoutes);

app.use("/v1/user", authHandler(), (req, res) => {
  res.json({ user: { nickname: req.user.nickname } });
});

const file = readFileSync("src/docs/bookmarker.yaml", "utf8");
const swaggerDocument = YAML.parse(file);
const serverFile = readFileSync("src/docs/bookmarkerServer.yaml", "utf8");
const serverSwaggerDocument = YAML.parse(serverFile);

app.use("/user-docs", authHandler(), swaggerUi.serveFiles(swaggerDocument), swaggerUi.setup(swaggerDocument));

app.use("/server-docs", swaggerUi.serveFiles(serverSwaggerDocument), swaggerUi.setup(serverSwaggerDocument));

// Auth error handling middleware
app.use((err, req, res, next) => {
  if (err.name === "UnauthorizedError") {
    res.status(401).json({ error: "Authentication error" });
  } else if (err.name === "InvalidTokenError") {
    res.status(401).json({ error: "Invalid token" });
  } else {
    next(err);
  }
});

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server listening on port http://localhost:${port}`);
});
