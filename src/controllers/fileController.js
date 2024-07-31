const {
  listFiles,
  uploadFile,
  getFile,
} = require("../applications/fileRepository");
const { HttpError, ControllerWrapper } = require("../helpers");

const listFilesController = async (req, res) => {
  const result = await listFiles();
  console.log(result);
  res.json(result);
};

const uploadFileController = async (req, res) => {
  const { name, description } = req.body;
  const { originalname, size, buffer, mimetype } = req.file;
  console.log(req.file);

  const extension = originalname.split(".").pop();

  const file = await uploadFile({
    name,
    description,
    size,
    extension,
    buffer,
    mimeType: mimetype,
  });
  if (size < 1024) {
    return res.status(400).json({ message: "File size must be at least 1KB" });
  }
  if (size > 7 * 1024 * 1024 * 1024) {
    return res.status(400).json({ message: "File size must not exceed 7GB" });
  }
  res.status(201).json(file);
};

const getFileController = async (req, res) => {
  const file = await getFile(req.params.id);
  console.log("File returned from repository:", file);
  if (!file) {
    throw HttpError(404, "File not found");
  }

  res.json(file);
};

module.exports = {
  listFiles: ControllerWrapper(listFilesController),
  uploadFile: ControllerWrapper(uploadFileController),
  getFile: ControllerWrapper(getFileController),
};
