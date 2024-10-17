import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import bookmarkRoutes from './routes/bookmarkRoutes.js';
import errorHandler from './utils/errorHandler.js';
import authenticateJWT from './middleware/authHandler.js';

const app = express();
const port = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Serve the index.html file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Serve the login.html file
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Serve the register.html file
app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

// Use the bookmark routes
app.use('/v1', bookmarkRoutes);

app.use(errorHandler)
app.use(authenticateJWT)

app.listen(port, () => {
  console.log(`Server listening on port http://localhost:${port}`);
});