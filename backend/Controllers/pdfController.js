const fs = require('fs');
const pdf = require('pdf-parse');
const path = require('path');

function preprocessOCRText(text) {
  text = text.replace(/\s+/g, ' ').trim();
  text = text.replace(/([A-Za-z])\s([A-Za-z])/g, '$1 $2');
  text = text.replace(/([A-Za-z])\n([A-Za-z])/g, '$1 $2');
  text = text.replace(/[^\x00-\x7F]/g, '');
  text = text.replace(/\d{1,2}[-\/]\d{1,2}[-\/]\d{4}/g, '');
  return text;
}

function formatDate(date) {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
}

function extractData(text, id) {
  const cleanedText = preprocessOCRText(text);
  const doctorNameMatch = cleanedText.match(/(?:Dr|Miss|Ms|Mr)\s([A-Za-z]+(?:\s[A-Za-z]+))\s/);
  const expiryDateMatch = cleanedText.match(/until\s(.+?)(?:,|\s?\.|\n|$)/i);
  const durationMatch = cleanedText.match(/(\d+)\sMonth\(s\)/i);

  let extractedExpiryDate = null;

  if (expiryDateMatch) {
    const dateMatch = expiryDateMatch[1].match(/\b(?:\d{1,2}[-\/]?\d{1,2}[-\/]\d{4}|(?:\d{1,2}\s?[A-Za-z]{3,9}\s?\d{4}))\b/);
    if (dateMatch) {
      const parsedDate = new Date(dateMatch[0]);
      extractedExpiryDate = formatDate(parsedDate);
    }
  }

  if (!extractedExpiryDate && durationMatch) {
    const months = parseInt(durationMatch[1], 10);
    const currentDate = new Date();
    currentDate.setMonth(currentDate.getMonth() + months);
    extractedExpiryDate = formatDate(currentDate);
  }

  const mapNumber = cleanedText.match(/MAP\d{2,}-\d+/) || null;
  const mbNumber = cleanedText.match(/(\s*)?MB\d{2,}-\d+/) || null;
  const productType = cleanedText.match(/Category\s[1-5]/) || null;

  return {
    id,
    doctorName: doctorNameMatch ? doctorNameMatch[1] : null,
    expiryDate: extractedExpiryDate,
    mapNumber: mapNumber ? mapNumber[0] : null,
    mbNumber: mbNumber ? mbNumber[0] : null,
    productType: productType ? productType[0] : null
  };
}

async function processPdf(filePath) {
  const fileExtension = path.extname(filePath).toLowerCase();
  if (fileExtension === '.pdf') {
    const data = fs.readFileSync(filePath);
    try {
      const parsedPdf = await pdf(data);
      if (parsedPdf.text.trim().length > 0) {
        return parsedPdf.text;
      }
    } catch (error) {
      throw new Error(`Failed to parse PDF: ${error.message}`);
    }
  }
  return null;
}

const processPdfs = async () => {
  const pdfFolder = path.join(__dirname, '../Uploads');
  const files = fs.readdirSync(pdfFolder).filter(file => file.endsWith('.pdf'));

  const results = [];
  let idCounter = 1;

  for (const file of files) {
    const filePath = path.join(pdfFolder, file);
    try {
      const extractedText = await processPdf(filePath);
      if (extractedText) {
        const extractedData = extractData(extractedText, idCounter);
        results.push({
          file: file,
          ...extractedData
        });
      } else {
        results.push({
          file: file,
          error: 'No text found in PDF'
        });
      }
      idCounter++;
    } catch (fileError) {
      results.push({
        file: file,
        error: fileError.message
      });
    }
  }

  return results;
};

exports.getPdfData = async (req, res) => {
  try {
    const pdfData = await processPdfs();
    res.json(pdfData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
