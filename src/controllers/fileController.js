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
  const file = await uploadFile({
    name: req.body.name,
    description: req.body.description,
    size: req.file.size,
    extension: extension,
    buffer: req.file.buffer,
  });
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
