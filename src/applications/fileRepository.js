const File = require("../domain/models/file");
const {
  uploadFileToSupabase,
  getFileFromSupabase,
} = require("../infrastructure/storage/SupabaseStorage");

const listFiles = async () => {
  const files = await File.find();
  return files;
};

const uploadFile = async (fileData) => {
  const filePath = `${fileData.name}`;
  const supabaseResponse = await uploadFileToSupabase(
    filePath,
    fileData.buffer
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
