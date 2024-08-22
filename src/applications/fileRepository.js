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
  const existingFile = await File.findOne({
    originalname: fileData.originalname,
  });
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

const searchFiles = async (query, page, limit) => {
  const skip = (page - 1) * limit;

  const result = await File.aggregate([
    {
      $search: {
        index: "search", 
        text: {
          query: query,
          path: ["name", "description"],
          fuzzy: {
            maxEdits: 2,
            prefixLength: 1,
            maxExpansions: 50,
          },
        },
      },
    },
    { $sort: { createdAt: -1 } },
    { $skip: skip },
    { $limit: parseInt(limit) },
    {
      $facet: {
        files: [{ $limit: parseInt(limit) }],
        countFiles: [{ $count: "total" }],
      },
    },
  ]);

  return {
    files: result[0].files,
    countFiles: result[0].countFiles[0] ? result[0].countFiles[0].total : 0,
  };
};


module.exports = { listFiles, uploadFile, getFile, searchFiles };
