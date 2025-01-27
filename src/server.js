import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import bookmarkRoutes from "./routes/bookmarkRoutes.js";
import errorHandler from "./middleware/errorHandler.js";
import authPkg from "express-openid-connect";
const { auth, requiresAuth } = authPkg;
import dotenv from "dotenv";
import { authHandler } from "./middleware/authHandler.js";
import helmet from 'helmet';

dotenv.config();

const app = express();
const port = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      imgSrc: ["'self'", 'https://robohash.org'],
    }
  }
}));
app.use(express.json());

const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.AUTH_SECRET,
  baseURL: process.env.BASE_URL,
  clientID: process.env.AUTH_CLIENT_ID,
  issuerBaseURL: process.env.AUTH_ISSUER_BASE_URL,
  routes: {
    login: false,
  },
  session: {
    absoluteDuration: 24 * 60 * 60, // 24 hours
    rolling: true,
  },
};

app.use(auth(config));

app.use(express.static(path.join(__dirname, "public")));

// Serve the index.html file
app.get("/", requiresAuth(), (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/login", (req, res) => {
  if (req.oidc.isAuthenticated()) {
    return res.redirect("/profile");
  }
  res.oidc.login({
    returnTo: "/profile",
  });
});

// Auth callback handler
app.get("/callback", (req, res) => {
  try {
    res.redirect("/profile");
  } catch (error) {
    console.error("Auth callback error:", error);
    res.redirect("/login");
  }
});

// Serve the profile.html file
app.get("/profile", requiresAuth(), (req, res) => {
  res.sendFile(path.join(__dirname, "public", "profile.html"));
});

// Use the bookmark routes
app.use("/v1", authHandler(), bookmarkRoutes);

app.use("/v1/user", authHandler(), (req, res) => {
  res.json({ user: { nickname: req.user.nickname } });
});

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
