import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import bookmarkRoutes from './routes/bookmarkRoutes.js';
import errorHandler from './middleware/errorHandler.js';
import authPkg from 'express-openid-connect';
const { auth, requiresAuth } = authPkg;
import dotenv from "dotenv";
import { authHandler } from './middleware/authHandler.js';

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
  issuerBaseURL: process.env.AUTH_ISSUER_BASE_URL,
  routes: {
    login: false,
  },
};

app.use(auth(config));

app.use(express.static(path.join(__dirname, 'public')));

// Serve the index.html file
app.get('/', requiresAuth(), (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/login', (req, res) =>{
  if (req.oidc.isAuthenticated()) {
    return res.redirect('/profile');
  }
  res.oidc.login({
    returnTo: '/profile',
    authorizationParams: {
      redirect_uri: 'http://localhost:3000/callback',
    },
  })
});

// Serve the profile.html file
app.get('/profile', requiresAuth(), (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'profile.html'));
});

// Use the bookmark routes
app.use('/v1', authHandler(), bookmarkRoutes);

app.use('/v1/user', authHandler(), (req, res) => {
  res.json(req.oidc.user);
})

app.use(errorHandler)

app.listen(port, () => {
  console.log(`Server listening on port http://localhost:${port}`);
});