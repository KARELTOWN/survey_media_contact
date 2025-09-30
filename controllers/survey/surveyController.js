import { matchedData, validationResult } from "express-validator";
import surveyService from "../../services/survey/surveyService.js";
const { getAnswers, getStatistics } = surveyService();
import SurveyTemplate from "../../models/SurveyTemplate.js";
import Survey from "../../models/Survey.js";
import { surveyFields, surveyOperators } from "../../utils/survey.js";
import Question from "../../models/Question.js";
import Answer from "../../models/Answer.js";
import { v4 } from "uuid";
import mailingPug from "../../services/mailing.js";

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
      let surveys_templates = await SurveyTemplate.find({
        owner_id: req.owner_id
      })
        .select([
          "_id",
          "title",
          "description",
          "publish",
          "createdAt",
          "updatedAt",
        ])
        .populate(["topic_id", "category_id", "created_by"])
        .sort({ createdAt: -1 });

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
      data.owner_id = req.owner_id;
      data.account_type_ref = req.account_type_ref;
      let survey_template = await SurveyTemplate.insertOne(data);

      let questions = data.questions.map((q) => ({
        ...q,
        _id: q.question_id,
        survey_id: survey_template._id,
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
      let email_body_data = [];
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
            let question_data = await Question.findById(question_id).select([
              "title",
              "type_field",
            ]);
            email_body_data.push({
              question_libelle: question_data.title,
              question_field: question_data.type_field,
              response: data.response,
            });
          }
        }
        await Answer.insertMany(instances);
      }

      let template = await SurveyTemplate.findById(result.survey_id)
        .populate("created_by")
        .select(["title", "description", "created_by"])
        .exec();

      mailingPug(
        template.created_by.email,
        `Réponse d'enquête : ${template.title.substring(0, 20)}`,
        "newresponse.pug",
        {
          data: email_body_data,
          title: template.title,
          description: template.description,
        }
      );
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

      const responses = await getAnswers(data.survey_id);

      return res.status(200).json({
        message: "Données récupérées",
        data: responses,
      });
    } catch (error) {
      next(error);
    }
  };

  const getSurveysStatistics = async (req, res, next) => {
    try {
      const data = matchedData(req);
      const responses = await getAnswers(data.survey_id);
      const result = await getStatistics(responses, data.survey_id);

      return res.status(200).json({
        message: "Statistiques récupérées",
        data: {
          statistics: result.statistics,
          total_responses: result.total_responses,
        },
      });
    } catch (err) {
      next(err);
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
    getSurveysStatistics,
  };
}
