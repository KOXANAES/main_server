const fs = require('fs-extra');
const path = require('path');

const srcDir = path.join(__dirname, 'src/androidApp');
const destDir = path.join(__dirname, 'dist/androidApp');

fs.copy(srcDir, destDir)
  .then(() => console.log('Assets copied successfully!'))
  .catch(err => console.error('Error copying assets:', err));

