process.env.PATH = `/opt/homebrew/opt/imagemagick/bin:${process.env.PATH}`;
process.env.GM_PATH = 'magick';

const express = require('express');
const cors = require('cors');
const path = require('path');
const pdfRoutes = require('./routes/pdfRoutes');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.use('/api/pdfs', pdfRoutes); 

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});