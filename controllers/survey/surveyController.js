import { matchedData, validationResult } from "express-validator";
import surveyService from "../../services/survey/surveyService.js";

import SurveyTemplate from "../../models/SurveyTemplate.js";
import Survey from "../../models/Survey.js";
import { surveyFields, surveyOperators } from "../../utils/survey.js";
import Question from "../../models/Question.js";
import Answer from "../../models/Answer.js";
import { v4 } from "uuid";
import mongoose from "../../config/mongodb.js";

export default function surveyController() {
  const getSurveyParams = async (req, res, next) => {
    try {
      const questions_field_types = surveyFields;
      const logic_operators = surveyOperators;

      return res.status(200).json({
        message: "Paramètres récupérés",
        data: {
          questions_field_types,
          logic_operators,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  const getSurveys = async (req, res, next) => {
    try {
      let surveys_templates = await SurveyTemplate.find({})
        .select([
          "_id",
          "title",
          "description",
          "publish",
          "createdAt",
          "updatedAt",
        ])
        .populate(["topic_id", "category_id", "created_by"]);

      return res.status(200).json({
        data: surveys_templates,
        message: "Surveys récupérés",
      });
    } catch (error) {
      next(error);
    }
  };

  const showSurvey = async (req, res, next) => {
    try {
      const data = matchedData(req);
      let survey_template = await SurveyTemplate.findById(data.survey_id);

      return res.status(200).json({
        data: survey_template,
        message: "Survey récupéré",
      });
    } catch (error) {
      next(error);
    }
  };

  const createSurvey = async (req, res, next) => {
    try {
      const data = matchedData(req);
      data.created_by = req.user._id;
      data.direction_id = req.direction_id || null;
      let survey_template = await SurveyTemplate.insertOne(data);
      let survey = await Survey.create(data);

      let questions = data.questions.map((q) => ({
        ...q,
        _id: q.question_id,
        survey_id: survey._id,
      }));

      await Question.insertMany(questions);
      return res.status(200).json({
        data: survey_template._id,
        message: "Survey créé avec succès",
      });
    } catch (error) {
      next(error);
    }
  };

  const getSurveyForm = async (req, res, next) => {
    try {
      const data = matchedData(req);
      let survey = await SurveyTemplate.findById(data.survey_id);
      return res.status(200).json({
        data: survey,
        message: "Formulaire récupéré",
      });
    } catch (error) {
      next(error);
    }
  };

  const createResponseToSurvey = async (req, res, next) => {
    try {
      const result = matchedData(req);
      let instances = [];
      let user_id = v4();
      if (Array.isArray(result.responses) && result.responses.length > 0) {
        for (const data of result.responses) {
          let question_id = data.question;

          if (
            (Array.isArray(data.response) && data.response.length > 0) ||
            (!Array.isArray(data.response) && data.response)
          ) {
            instances.push({
              survey_id: result.survey_id,
              question_id: question_id,
              response: data.response,
              metadata: result.metadata,
              created_by: user_id,
            });
          }
        }
        let data = await Answer.insertMany(instances);
      }

      return res.status(200).json({
        message: "Données envoyées",
      });
    } catch (error) {
      next(error);
    }
  };

  const surveyResponses = async (req, res, next) => {
    try {
      const data = matchedData(req);
      const responses = await Answer.aggregate([
        {
          $match: {
            survey_id: new mongoose.Types.ObjectId(data.survey_id),
          },
        },
        {
          $lookup: {
            from: "questions",
            localField: "question_id",
            foreignField: "_id",
            as: "question",
          },
        },
        {
          $unwind: "$question",
        },
        {
          $group: {
            _id: "$created_by",
            answers: {
              $push: {
                question_id: "$question_id",
                question_label: "$question.title",
                response: "$response",
                createdAt: "$createdAt",
                question_type_field: "$question.type_field",
              },
            },
            total: { $sum: 1 },
          },
        },
      ]);

      return res.status(200).json({
        message: "Données récupérées",
        data: responses,
      });
    } catch (error) {
      next(error);
    }
  };

  return {
    getSurveyParams,
    createSurvey,
    getSurveyForm,
    createResponseToSurvey,
    getSurveys,
    showSurvey,
    surveyResponses,
  };
}
