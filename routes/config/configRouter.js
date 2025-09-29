import express from "express";
const configRouter = express.Router();
import configController from "../../controllers/config/configController.js";

const { getConfig, updateConfig, getConfigFromSurveyId } = configController();
import { validateConfigUpdate } from "../../validator/config/configValidator.js";
import isauthentificate from "../../middleware/isAuthentificate.js";
import { blacklist } from "../../middleware/blacklist.js";
import checkAccountHeaders from "../../middleware/checkAccountHeaders.js";
import { validateSurveyId } from "../../validator/survey/surveyValidator.js";

configRouter.post(
  "/update",
  isauthentificate,
  blacklist,
  checkAccountHeaders,
  validateConfigUpdate,
  updateConfig
);
configRouter.get("/get", isauthentificate, blacklist, checkAccountHeaders, getConfig);
configRouter.get("/survey_config/:survey_id", validateSurveyId, getConfigFromSurveyId);

export default configRouter;
