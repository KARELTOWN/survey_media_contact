import { matchedData, validationResult } from "express-validator";
import surveyService from "../../services/survey/surveyService.js";
const {
  getLogicOperators,
  getQuestionFieldTypes,
} = surveyService()

import Survey from "../../models/Survey.js";

export default function surveyController() {

  const getSurveyParams = async (req, res, next) => {
    try {
      const logic_operators = await getLogicOperators()
      const questions_field_types = await getQuestionFieldTypes()

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
