import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import bookmarkRoutes from './routes/bookmarkRoutes.js';
import errorHandler from './middleware/errorHandler.js';
import authPkg from 'express-openid-connect';
const { auth, requiresAuth } = authPkg;
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());

const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.AUTH_SECRET,
  baseURL: process.env.BASE_URL,
  clientID: process.env.AUTH_CLIENT_ID,
  issuerBaseURL: process.env.AUTH_ISSUER_BASE_URL
};

app.use(auth(config));

app.use(requiresAuth())

app.use(express.static(path.join(__dirname, 'public')));

// Serve the index.html file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Use the bookmark routes
app.use('/v1', bookmarkRoutes);

app.use(errorHandler)

app.listen(port, () => {
  console.log(`Server listening on port http://localhost:${port}`);
});