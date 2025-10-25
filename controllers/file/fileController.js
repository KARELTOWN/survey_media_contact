import fileService from "../../services/file/fileService.js";
import FileUpload from "../../models/FileUpload.js";
const { uploadFileOnS3, uploadInFileLocal } = fileService();
export default function fileController() {
  // NOT USE ACTUALLY
  const responseFileUpload = async (req, res, next) => {
    try {
      let filePath = "survey_reveal/responses";
      let filename = await uploadFileOnS3(req.file, filePath);
      if (filename) {
        let file_save = await FileUpload.insertOne({
          path: `${filePath}/${filename}`,
          original_name: Buffer.from(req.file.originalname, "utf8").toString(),
          name: filename,
          mimetype: req.file.mimetype,
        });
        return res
          .status(200)
          .json({ message: "Téléverser", data: file_save._id });
      }
    } catch (err) {
      next(err);
    }
  };

  const tempFileUpload = async (req, res, next) => {
    try {
      let filename = await uploadInFileLocal(req.file);
      return res.status(200).json({ message: "Téléverser", data: filename });
    } catch (err) {
      next(err);
    }
  };

  return {
    responseFileUpload,
    tempFileUpload,
  };
}
