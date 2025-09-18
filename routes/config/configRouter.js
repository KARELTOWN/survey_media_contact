import express from "express";
const configRouter = express.Router();
import configController from "../../controllers/config/configController.js";
const { getConfig, updateConfig } = configController();
import { validateConfigUpdate } from "../../validator/config/configValidator.js";
import isauthentificate from "../../middleware/isAuthentificate.js";
import { blacklist } from "../../middleware/blacklist.js";

configRouter.post(
  "/update",
  isauthentificate,
  blacklist,
  validateConfigUpdate,
  updateConfig
);
configRouter.get("/get", getConfig);

export default configRouter;
