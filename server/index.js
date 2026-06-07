const fs = require('fs');
const path = require('path');

const distEntry = path.join(__dirname, 'dist', 'index.js');

if (!fs.existsSync(distEntry)) {
  console.error('ERROR: dist/index.js not found. TypeScript must be compiled before start.');
  console.error('Set Render Build Command to: npm install && npm run build');
  process.exit(1);
}

require(distEntry);
