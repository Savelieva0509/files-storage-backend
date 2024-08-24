const express = require("express");
const fs = require("fs");
const ctrl = require("../../controllers/fileController");
const { addSchema } = require("../../domain/schemas/addSchema");
const {
  validateBody,
  isValidId,
  validateFileSize,
} = require("../../middlewares");
const router = express.Router();
const multer = require("multer");

const uploadDir = "/tmp/my-uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "/tmp/my-uploads");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});
const upload = multer({ storage: storage });

router.get("/", ctrl.listFiles);

router.patch("/:id", isValidId, ctrl.updateCount);

router.post(
  "/",
  upload.single("file"),
  validateBody(addSchema),
  validateFileSize,
  ctrl.uploadFile
);

router.get("/search", ctrl.searchFiles);

module.exports = router;
