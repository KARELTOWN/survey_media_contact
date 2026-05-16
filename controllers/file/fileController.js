import fileService from "../../services/file/fileService.js";
import FileUpload from "../../models/FileUpload.js";
import { isValidObjectId } from "mongoose";
const { uploadFileOnS3, uploadInFileLocal, getFileOnS3 } = fileService();
export default function fileController() {
  const publicFileUrl = (req, fileId) => {
    return `${req.protocol}://${req.get("host")}/api/file/public/${fileId}`;
  };

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

  const formImageUpload = async (req, res, next) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "Aucun fichier envoye" });
      }

      if (!req.file.mimetype?.startsWith("image/")) {
        return res.status(422).json({ message: "Le fichier doit etre une image" });
      }

      if (req.file.size > 5 * 1024 * 1024) {
        return res.status(422).json({ message: "L'image ne doit pas depasser 5 Mo" });
      }

      const filePath = "survey_reveal/forms/images";
      const filename = await uploadFileOnS3(req.file, filePath);

      const fileSave = await FileUpload.insertOne({
        path: `${filePath}/${filename}`,
        original_name: Buffer.from(req.file.originalname, "utf8").toString(),
        name: filename,
        mimetype: req.file.mimetype,
      });

      return res.status(200).json({
        message: "Image televersee",
        data: {
          id: fileSave._id,
          url: publicFileUrl(req, fileSave._id),
        },
      });
    } catch (err) {
      return res.status(500).json({
        message: err.message || "Impossible de televerser l'image",
      });
    }
  };

  const getPublicFile = async (req, res, next) => {
    try {
      const fileId = req.params.file_id;
      if (!isValidObjectId(fileId)) {
        return res.status(404).json({ message: "Fichier introuvable" });
      }

      const file = await FileUpload.findById(fileId);
      if (!file) {
        return res.status(404).json({ message: "Fichier introuvable" });
      }

      const signedUrl = await getFileOnS3(file.path);
      return res.redirect(signedUrl);
    } catch (err) {
      next(err);
    }
  };

  return {
    responseFileUpload,
    tempFileUpload,
    formImageUpload,
    getPublicFile,
  };
}
