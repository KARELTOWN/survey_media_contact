import express from "express";
const SurveyRouter = express.Router();

import {
  surveyValidator,
  surveyModelValidator,
  validateSurveyId,
  surveyResponseValidator,
  validateDateFilter,
  validateSurveyIdInBody,
  validatePublishSurvey,
} from "../../validator/survey/surveyValidator.js";
import surveyController from "../../controllers/survey/surveyController.js";

import isauthentificate from "../../middleware/isAuthentificate.js";
import { blacklist } from "../../middleware/blacklist.js";
import checkAccountHeaders from "../../middleware/checkAccountHeaders.js";
import permissionCheck from "../../middleware/permissionCheck.js";

const {
  getSurveyParams,
  createSurvey,
  createSurveyModel,
  updateSurvey,
  getSurveyForm,
  createResponseToSurvey,
  getSurveys,
  getSurveysModels,
  showSurvey,
  surveyResponses,
  getSurveysStatistics,
  createExcel,
  duplicateSurvey,
  togglePublishSurvey,
  archiveSurvey,
  deleteSurvey,
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

SurveyRouter.post(
  "/create/model",
  isauthentificate,
  checkAccountHeaders,
  blacklist,
  permissionCheck("AE"),
  surveyModelValidator,
  createSurveyModel
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

SurveyRouter.post(
  "/duplicate/:survey_id",
  isauthentificate,
  checkAccountHeaders,
  blacklist,
  validateSurveyId,
  duplicateSurvey
);

SurveyRouter.patch(
  "/publish",
  isauthentificate,
  checkAccountHeaders,
  blacklist,
  validatePublishSurvey,
  togglePublishSurvey
);

SurveyRouter.patch(
  "/archive/:survey_id",
  isauthentificate,
  checkAccountHeaders,
  blacklist,
  validateSurveyId,
  archiveSurvey
);

SurveyRouter.delete(
  "/delete/:survey_id",
  isauthentificate,
  checkAccountHeaders,
  blacklist,
  validateSurveyId,
  deleteSurvey
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
  "/get/models",
  isauthentificate,
  checkAccountHeaders,
  blacklist,
  getSurveysModels
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

SurveyRouter.post(
  "/detail/responses",
  isauthentificate,
  checkAccountHeaders,
  blacklist,
  permissionCheck("RE"),
  validateSurveyIdInBody,
  validateDateFilter,
  surveyResponses
);

SurveyRouter.post(
  "/statistics",
  isauthentificate,
  checkAccountHeaders,
  blacklist,
  permissionCheck("SE"),
  validateSurveyIdInBody,
  validateDateFilter,
  getSurveysStatistics
);

export default SurveyRouter;
