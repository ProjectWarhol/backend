const fs = require('fs');
// Remove file from temporary folder
exports.removeTemporaryFile = (filePath) => {
  try {
    fs.unlinkSync(filePath);
    return true;
  } catch (err) {
    return false;
  }
};
