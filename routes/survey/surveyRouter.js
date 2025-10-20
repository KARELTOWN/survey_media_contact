import express from "express";
const SurveyRouter = express.Router();

import {
  surveyValidator,
  validateSurveyId,
  surveyResponseValidator,
} from "../../validator/survey/surveyValidator.js";
import surveyController from "../../controllers/survey/surveyController.js";

import isauthentificate from "../../middleware/isAuthentificate.js";
import { blacklist } from "../../middleware/blacklist.js";
import checkAccountHeaders from "../../middleware/checkAccountHeaders.js";
import permissionCheck from "../../middleware/permissionCheck.js";
import { uploadHelper } from "../../helpers/uploadHelper.js";

const {
  getSurveyParams,
  createSurvey,
  updateSurvey,
  getSurveyForm,
  createResponseToSurvey,
  getSurveys,
  showSurvey,
  surveyResponses,
  getSurveysStatistics,
  createExcel,
} = surveyController();

SurveyRouter.get(
  "/params",
  isauthentificate,
  checkAccountHeaders,
  blacklist,
  getSurveyParams
);
SurveyRouter.get("/form/:survey_id", validateSurveyId, getSurveyForm);

SurveyRouter.post(
  "/create",
  isauthentificate,
  checkAccountHeaders,
  blacklist,
  permissionCheck("AE"),
  surveyValidator,
  createSurvey
);

SurveyRouter.put(
  "/update/:survey_id",
  isauthentificate,
  checkAccountHeaders,
  blacklist,
  permissionCheck("UPE"),
  validateSurveyId,
  surveyValidator,
  updateSurvey
);

SurveyRouter.get(
  "/export_excel/:survey_id",
  isauthentificate,
  checkAccountHeaders,
  blacklist,
  permissionCheck("SURVEY_EXCEL"),
  validateSurveyId,
  createExcel
);

SurveyRouter.get(
  "/get",
  isauthentificate,
  checkAccountHeaders,
  blacklist,
  getSurveys
);

SurveyRouter.get(
  "/show/:survey_id",
  isauthentificate,
  checkAccountHeaders,
  blacklist,
  permissionCheck("DE"),
  validateSurveyId,
  showSurvey
);

SurveyRouter.put(
  "/responses/:survey_id",
  validateSurveyId,
  surveyResponseValidator,
  createResponseToSurvey
);

SurveyRouter.get(
  "/detail/responses/:survey_id",
  isauthentificate,
  checkAccountHeaders,
  blacklist,
  permissionCheck("RE"),
  validateSurveyId,
  surveyResponses
);

SurveyRouter.get(
  "/statistics/:survey_id",
  isauthentificate,
  checkAccountHeaders,
  blacklist,
  permissionCheck("SE"),
  validateSurveyId,
  getSurveysStatistics
);

export default SurveyRouter;
