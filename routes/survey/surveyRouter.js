
import express from "express";
const SurveyRouter = express.Router();

import { surveyValidator, validateSurveyId, surveyResponseValidator } from "../../validator/survey/surveyValidator.js";
import surveyController from "../../controllers/survey/surveyController.js";

import isauthentificate from "../../middleware/isAuthentificate.js";
import { blacklist } from "../../middleware/blacklist.js";
import checkAccountHeaders from "../../middleware/checkAccountHeaders.js";

const {
  getSurveyParams,
  createSurvey,
  getSurveyForm,
  createResponseToSurvey,
  getSurveys,
  showSurvey,
  surveyResponses,
  getSurveysStatistics
} = surveyController();

SurveyRouter.get(
  "/params",
  isauthentificate,
  checkAccountHeaders,
  blacklist,
  getSurveyParams
);
SurveyRouter.get(
  "/form/:survey_id",
  validateSurveyId,
  getSurveyForm
);

SurveyRouter.post(
  "/create",
  isauthentificate,
  checkAccountHeaders,
  blacklist,
  surveyValidator,
  createSurvey
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
  validateSurveyId,
  surveyResponses
);

SurveyRouter.get(
  "/statistics/:survey_id",
  isauthentificate,
  checkAccountHeaders,
  blacklist,
  validateSurveyId,
  getSurveysStatistics
);

export default SurveyRouter;
