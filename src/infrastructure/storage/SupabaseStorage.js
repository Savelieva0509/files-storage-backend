const { createClient } = require("@supabase/supabase-js");
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const uploadFileToSupabase = async (filePath, buffer) => {
  const { data, error } = await supabase.storage
    .from("files")
    .upload(filePath, buffer, {
      contentType: mimeType,
    });

  if (error) throw error;

  return data;
};

module.exports = { uploadFileToSupabase };
