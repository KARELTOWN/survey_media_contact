import { matchedData, validationResult } from "express-validator";
import surveyService from "../../services/survey/surveyService.js";
const {
  getLogicOperators,
  getQuestionFieldTypes,
} = surveyService()

import Survey from "../../models/Survey.js";
import { surveyFields, surveyOperators } from "../../utils/survey.js";

export default function surveyController() {

  const getSurveyParams = async (req, res, next) => {
    try {

      const questions_field_types = surveyFields
      const logic_operators = surveyOperators

      return res.status(200).json({
        message: "Paramètres récupérés",
        data: {
            questions_field_types,
            logic_operators
        },
      });
    } catch (error) {
      next(error);
    }
  };

  return {
    getSurveyParams,
  };
}
