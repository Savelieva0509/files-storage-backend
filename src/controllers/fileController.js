const {
  listFiles,
  uploadFile,
  getFile,
} = require("../applications/fileRepository");
const { ControllerWrapper, HttpError } = require("../helpers");

const listFilesController = async (req, res) => {
  const { page = 1, limit = 8 } = req.query;
  const result = await listFiles(page, limit);
  res.json(result);
};

const uploadFileController = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const { originalname, size, buffer, mimetype } = req.file;

    // Прсоверка размера файла
    if (size < 1024) {
      throw HttpError(400, "File size must be at least 1KB");
    }
    if (size > 7 * 1024 * 1024 * 1024) {
      throw HttpError(400, "File size must not exceed 7GB");
    }

    const file = await uploadFile({
      name,
      originalname,
      description,
      size,
      extension: originalname.split(".").pop(),
      buffer,
      mimeType: mimetype,
    });

    res.status(201).json(file);
  } catch (error) {
    if (error.message === "File with the same name already exists") {
      return res.status(400).json({ message: error.message });
    }
    next(error);
  }
};

const updateCountController = async (req, res) => {
  const { id } = req.params;
  const { downloadCount } = req.body;

  const file = await getFile(id);

  file.downloadCount = downloadCount;
  await file.save();

  res.json(file);
};

module.exports = {
  listFiles: ControllerWrapper(listFilesController),
  uploadFile: ControllerWrapper(uploadFileController),
  updateCount: ControllerWrapper(updateCountController),
};
