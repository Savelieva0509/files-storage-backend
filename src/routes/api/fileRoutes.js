const express = require("express");
const ctrl = require("../../controllers/fileController");
const { addSchema } = require("../../domain/schemas/addSchema");
const {
  validateBody,
  isValidId,
  validateFileSize,
} = require("../../middlewares");
const router = express.Router();
const multer = require("multer");

const upload = multer({
  limits: { fileSize: 7 * 1024 * 1024 * 1024 },
});

router.get("/", ctrl.listFiles);

router.patch("/:id", isValidId, ctrl.updateCount);

router.post(
  "/",
  upload.single("file"),
  validateBody(addSchema),
  validateFileSize,
  ctrl.uploadFile
);

module.exports = router;
