const express = require('express');
const { getPdfData } = require('../Controllers/pdfController');

const router = express.Router();

router.get('/', getPdfData);

module.exports = router;
