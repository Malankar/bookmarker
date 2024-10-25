import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import bookmarkRoutes from "./routes/bookmarkRoutes.js";
import session from "express-session";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const sessionSecret = process.env.SESSION_SECRET;
const sessionConfig = {
  secret: sessionSecret,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true, // Prevent client-side access to cookies
    sameSite: "strict", // Mitigate CSRF attacks
  },
};

if (process.env.NODE_ENV === "production") {
  sessionConfig.cookie.secure = true; // Enable only for HTTPS
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(session(sessionConfig));

// Serve the index.html file
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Use the bookmark routes
app.use("/v1", bookmarkRoutes);

app.listen(port, () => {
  console.log(`Server listening on port http://localhost:${port}`);
});
