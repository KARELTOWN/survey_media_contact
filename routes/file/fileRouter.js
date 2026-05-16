import express from "express";
import { uploadHelper } from "../../helpers/uploadHelper.js";
import fileController from "../../controllers/file/fileController.js";
import isauthentificate from "../../middleware/isAuthentificate.js";
import { blacklist } from "../../middleware/blacklist.js";
import checkAccountHeaders from "../../middleware/checkAccountHeaders.js";

const { responseFileUpload, tempFileUpload, formImageUpload, getPublicFile } = fileController();
let fileRouter = express.Router();

fileRouter.get("/public/:file_id", getPublicFile);

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

fileRouter.post(
  "/form/image",
  isauthentificate,
  checkAccountHeaders,
  blacklist,
  uploadHelper.single("file"),
  formImageUpload
);
export default fileRouter;
