const File = require("../domain/models/file");
const {
  uploadFileToSupabase,
} = require("../infrastructure/storage/SupabaseStorage");

const listFiles = async () => {
  const files = await File.find();
  return files;
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
