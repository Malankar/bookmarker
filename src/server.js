const express = require('express');
const path = require('path');
const app = express();
const bookmarkRoutes = require('./routes/bookmarkRoutes');

const port = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Serve the index.html file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Use the bookmark routes
app.use('/v1', bookmarkRoutes);

app.listen(port, () => {
  console.log(`Server listening on port http://localhost:${port}`);
});