const express = require("express");
const ctrl = require("../../controllers/fileController");
const { addSchema } = require("../../domain/schemas/addSchema");
const {
  validateBody,
  isValidId,
  validateFileSize,
} = require("../../middlewares");
const router = express.Router();

router.get("/", ctrl.listFiles);

router.get("/:id", isValidId, ctrl.getFile);

router.post("/", validateBody(addSchema), validateFileSize, ctrl.uploadFile);

module.exports = router;
