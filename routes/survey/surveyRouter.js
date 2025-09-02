
import express from "express";
const SurveyRouter = express.Router();

import surveyController from "../../controllers/survey/surveyController.js";

const {
  getSurveyParams,
} = surveyController();

SurveyRouter.get(
  "/params",
  getSurveyParams
);
export default SurveyRouter;
