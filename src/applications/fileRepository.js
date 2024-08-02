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
  const filePath = `${fileData.name}`;
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

const updateFile = async (id, updateData) => {
  const file = await File.findByIdAndUpdate(id, updateData, { new: true });
  return file;
};

module.exports = { listFiles, uploadFile, getFile, updateFile };
