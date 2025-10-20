import express from "express";
import { uploadHelper } from "../../helpers/uploadHelper.js";
import fileService from "../../services/file/fileService.js";
import FileUpload from "../../models/File.js";
const { uploadFileInJsonOnS3 } = fileService();
let fileRouter = express.Router();

fileRouter.post(
  "/upload",
  uploadHelper.single("file"),
  async (req, res, next) => {
    try {
      let filePath = "survey_reveal/responses";
      let filename = await uploadFileInJsonOnS3(req.file, filePath);
      if (filename) {
        let file_save = await FileUpload.insertOne({
          path: `${filePath}/${filename}`,
          original_name: req.file.originalname,
          name: filename,
          mimetype: req.file.mimetype
        });
        return res
          .status(200)
          .json({ message: "Uploader", data: file_save._id });
      }
    } catch (err) {
      next(err);
    }
  }
);
export default fileRouter;
