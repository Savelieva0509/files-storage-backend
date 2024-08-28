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
  const result = await File.aggregate([
    {
      $search: {
        index: "search",
        compound: {
          should: [
            {
              autocomplete: {
                query: query,
                path: "name",
                tokenOrder: "sequential",
                fuzzy: {
                  maxEdits: 2,
                  prefixLength: 1,
                  maxExpansions: 50,
                },
              },
            },
            {
              autocomplete: {
                query: query,
                path: "description",
                tokenOrder: "sequential",
                fuzzy: {
                  maxEdits: 2,
                  prefixLength: 1,
                  maxExpansions: 50,
                },
              },
            },
          ],
        },
      },
    },
    { $sort: { createdAt: -1 } }, 
  ]);

  const totalResults = result.length; 
  const paginatedFiles = result.slice((page - 1) * limit, page * limit); 

  return {
    files: paginatedFiles,
    countFiles: totalResults,
  };
};



module.exports = { listFiles, uploadFile, getFile, searchFiles };
