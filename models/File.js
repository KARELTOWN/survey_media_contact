import mongoose from "../config/mongodb.js";
const FileUploadSchema = new mongoose.Schema(
  {
    path: {
      type: String,
      unique: true,
      required: true,
    },
    original_name: {
      type: String,
      required: true,
    },
    mimetype: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const FileUpload = mongoose.model("FileUpload", FileUploadSchema);
export default FileUpload;
