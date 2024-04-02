const fs = require('fs').promises;

async function fetchTextFile(filePath) {
  return fs.readFile(filePath, 'utf-8');
}



module.exports = { fetchTextFile };