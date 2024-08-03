const File = require("../domain/models/file");
const {
  uploadFileToSupabase,
} = require("../infrastructure/storage/SupabaseStorage");

const listFiles = async (page, limit) => {
  const skip = (page - 1) * limit;
  const files = await File.find()
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));
  const countFiles = await File.countDocuments();
  return { files, countFiles };
};

const uploadFile = async (fileData) => {
  // Проверьте, существует ли файл с таким же именем в базе данных
  const existingFile = await File.findOne({ originalname: fileData.originalname });
  console.log(existingFile);
  if (existingFile) {
    throw new Error("File with the same name already exists");
  }
  console.log(existingFile);
  const filePath = `${fileData.originalname}`;
  const supabaseResponse = await uploadFileToSupabase(
    filePath,
    fileData.buffer,
    fileData.mimeType
  );

  const file = new File({
    ...fileData,
    url: supabaseResponse.url,
  });

  await file.save();
  return file;
};

const getFile = async (id) => {
  return await File.findById(id);
};

module.exports = { listFiles, uploadFile, getFile };
