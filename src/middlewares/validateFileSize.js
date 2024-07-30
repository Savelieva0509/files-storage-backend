const multer = require("multer");
const upload = multer({
  limits: { fileSize: 7 * 1024 * 1024 * 1024 },
});

const validateFileSize = (req, res, next) => {
  if (req.file.size < 1024 || req.file.size > 7 * 1024 * 1024 * 1024) {
    return res
      .status(400)
      .json({ message: "File size must be between 1KB and 7GB" });
  }
  next();
};

module.exports = validateFileSize;
