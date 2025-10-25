import express from "express";
import { uploadHelper } from "../../helpers/uploadHelper.js";
import fileController from "../../controllers/file/fileController.js";
const { responseFileUpload, tempFileUpload } = fileController();
let fileRouter = express.Router();
fileRouter.post(
  "/response/upload",
  uploadHelper.single("file"),
  responseFileUpload
);

fileRouter?.post(
  "/response/tmp_upload",
  uploadHelper.single("file"),
  tempFileUpload
);
export default fileRouter;
