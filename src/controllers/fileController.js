const {
  listFiles,
  uploadFile,
  getFile,
  updateFile,
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
