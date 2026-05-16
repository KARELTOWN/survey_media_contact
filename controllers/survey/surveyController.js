import { matchedData } from "express-validator";
import surveyService from "../../services/survey/surveyService.js";
const {
  getAnswers,
  getStatistics,
  saveSurveyHistoric,
  exportExcel,
  countSurveyResponse,
} = surveyService();
import SurveyTemplate from "../../models/SurveyTemplate.js";
import SurveyModel from "../../models/SurveyModel.js";
import { surveyFields, surveyOperators } from "../../utils/survey.js";
import Question from "../../models/Question.js";
import Answer from "../../models/Answer.js";
import { v4 } from "uuid";
import mailingPug from "../../services/mailing.js";
import moment from "moment";
import fileService from "../../services/file/fileService.js";
import { isValidObjectId } from "mongoose";
import _ from "lodash";
const { uploadTempFileOnS3 } = fileService();
import { saveResponseFileJob } from "../../jobs/queue.js";

export default function surveyController() {
  const getSurveyParams = async (req, res, next) => {
    try {
      const questions_field_types = surveyFields.filter(
        (e) => e.field !== "email"
      );
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
        owner_id: req.owner_id,
      })
        .select([
          "_id",
          "title",
          "description",
          "publish",
          "archived",
          "start_date",
          "end_date",
          "createdAt",
          "updatedAt",
          "formation_id",
          "module_id",
          "chapter_id",
          "trainer_id",
          "session_id",
        ])
        .populate([
          {
            path: "category_id",
            select: "libelle",
          },
          {
            path: "created_by",
            select: "firstname lastname",
          },
          {
            path: "formation_id",
            select: "nom",
          },
          {
            path: "module_id",
            select: "nom",
          },
          {
            path: "chapter_id",
            select: "nom",
          },
          {
            path: "trainer_id",
            select: "nom email",
          },
          {
            path: "session_id",
            select: "libelle date_debut date_fin",
          },
        ])
        .sort({ createdAt: -1 })
        .lean();

      for (const survey of surveys_templates) {
        survey.count_responses = await countSurveyResponse(survey._id);
      }

      return res.status(200).json({
        data: surveys_templates,
        message: "Surveys récupérés",
      });
    } catch (error) {
      next(error);
    }
  };

  const getSurveysModels = async (req, res, next) => {
    try {
      console.log(" req.owner_id", req.owner_id.toString());
      let surveys_templates = await SurveyModel.find({
        $or: [
          { owner_id: req.owner_id.toString() },
          { owner_id: { $exists: false } },
        ],
      })
        .select([
          "_id",
          "title",
          "description",
          "questions",
          "multiple_submission",
          "theme",
          "capture_mail",
          "response_mode",
          "formation_id",
          "module_id",
          "chapter_id",
          "trainer_id",
          "session_id",
        ])
        .populate([
          {
            path: "category_id",
            select: "libelle",
          },
          {
            path: "formation_id",
            select: "nom description",
          },
          {
            path: "module_id",
            select: "nom formation_id",
          },
          {
            path: "chapter_id",
            select: "nom module_id",
          },
          {
            path: "trainer_id",
            select: "nom email",
          },
          {
            path: "session_id",
            select: "libelle formation_id date_debut date_fin",
          },
        ])
        .sort({ createdAt: -1 })
        .lean();

      return res.status(200).json({
        data: surveys_templates,
        message: "Surveys models récupérés",
      });
    } catch (error) {
      next(error);
    }
  };

  const showSurvey = async (req, res, next) => {
    try {
      const data = matchedData(req);
      let survey_template = await SurveyTemplate.findById(data.survey_id)
        .populate([
          {
            path: "category_id",
            select: "libelle",
          },
          {
            path: "formation_id",
            select: "nom description",
          },
          {
            path: "module_id",
            select: "nom formation_id",
          },
          {
            path: "chapter_id",
            select: "nom module_id",
          },
          {
            path: "trainer_id",
            select: "nom email",
          },
          {
            path: "session_id",
            select: "libelle formation_id date_debut date_fin",
          },
        ])
        .select([
          "-account_type_ref",
          "-createdAt",
          "-created_by",
          "-lastEdit",
          "-updatedAt",
        ]);

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
      if (!data.start_date) {
        delete data.start_date;
      }
      let survey_template = await SurveyTemplate.create(data);

      let questions = data.questions.map((q) => ({
        ...q,
        _id: q.question_id,
        survey_id: survey_template._id,
      }));

      await Question.insertMany(questions);

      await saveSurveyHistoric(survey_template);

      return res.status(200).json({
        data: survey_template._id,
        message: "Survey créé avec succès",
      });
    } catch (error) {
      next(error);
    }
  };

  const createSurveyModelAdmin = async (req, res, next) => {
    try {
      const data = matchedData(req);
      let survey_model = await SurveyModel.create(data);
      return res.status(200).json({
        data: survey_model._id,
        message: "Survey Model créé avec succès",
      });
    } catch (error) {
      next(error);
    }
  };

  const createSurveyModel = async (req, res, next) => {
    try {
      const data = matchedData(req);
      data.owner_id = req.owner_id;
      data.account_type_ref = req.account_type_ref;
      let survey_model = await SurveyModel.create(data);
      return res.status(200).json({
        data: survey_model._id,
        message: "Survey Model créé avec succès",
      });
    } catch (error) {
      next(error);
    }
  };

  const updateSurvey = async (req, res, next) => {
    try {
      const data = matchedData(req);
      if (!data.start_date) {
        delete data.start_date;
      }
      let survey_template = await SurveyTemplate.findByIdAndUpdate(
        data.survey_id,
        {
          ...data,
        }
      );

      let questions = data.questions.map((q) => {
        const { _id, ...rest } = q; // on retire _id
        return {
          updateOne: {
            filter: { _id: q.question_id },
            update: {
              $set: {
                ...rest,
                survey_id: survey_template._id,
              },
            },
            upsert: true,
          },
        };
      });

      await Question.bulkWrite(questions);

      await saveSurveyHistoric(survey_template);

      return res.status(200).json({
        data: survey_template._id,
        message: "Survey modifié avec succès",
      });
    } catch (error) {
      next(error);
    }
  };

  const duplicateSurvey = async (req, res, next) => {
    try {
      const data = matchedData(req);
      const source = await SurveyTemplate.findOne({
        _id: data.survey_id,
        owner_id: req.owner_id,
      }).lean();
      if (!source) {
        return res.status(404).json({ message: "Enquête introuvable" });
      }
      const { _id, createdAt, updatedAt, questions = [], ...payload } = source;
      payload.form_id = v4();
      payload.title = `${source.title} - copie`;
      payload.publish = false;
      payload.archived = false;
      payload.created_by = req.user._id;
      payload.owner_id = req.owner_id;
      payload.account_type_ref = req.account_type_ref;
      payload.questions = questions.map((question) => ({
        ...question,
        question_id: v4(),
      }));
      const survey = await SurveyTemplate.create(payload);
      await Question.insertMany(payload.questions.map((question) => ({
        ...question,
        _id: question.question_id,
        survey_id: survey._id,
      })));
      return res.status(200).json({ data: survey._id, message: "Enquête dupliquée" });
    } catch (error) {
      next(error);
    }
  };

  const togglePublishSurvey = async (req, res, next) => {
    try {
      const data = matchedData(req);
      const survey = await SurveyTemplate.findOneAndUpdate(
        { _id: data.survey_id, owner_id: req.owner_id },
        { publish: data.publish },
        { new: true }
      );
      return res.status(200).json({ data: survey, message: "Publication mise à jour" });
    } catch (error) {
      next(error);
    }
  };

  const archiveSurvey = async (req, res, next) => {
    try {
      const data = matchedData(req);
      const survey = await SurveyTemplate.findOneAndUpdate(
        { _id: data.survey_id, owner_id: req.owner_id },
        { archived: true, publish: false },
        { new: true }
      );
      return res.status(200).json({ data: survey, message: "Enquête archivée" });
    } catch (error) {
      next(error);
    }
  };

  const deleteSurvey = async (req, res, next) => {
    try {
      const data = matchedData(req);
      const survey = await SurveyTemplate.findOneAndDelete({
        _id: data.survey_id,
        owner_id: req.owner_id,
      });

      if (!survey) {
        return res.status(404).json({ message: "Enquete introuvable" });
      }

      await Question.deleteMany({ survey_id: data.survey_id });
      await Answer.deleteMany({ survey_id: data.survey_id });

      return res.status(200).json({
        data: data.survey_id,
        message: "Enquete supprimee",
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
      let uploadFileJobData = [];
      if (Array.isArray(result.responses) && result.responses.length > 0) {
        for (const data of result.responses) {
          let files_not_uploads = [];
          let question_id = data.question;
          if (
            (Array.isArray(data.response) && data.response.length > 0) ||
            (!Array.isArray(data.response) && data.response)
          ) {
            let data_to_save = {};
            let question_instance = await Question.findById(
              data.question
            ).select("type_field");

            if (question_instance.type_field === "file") {
              data_to_save = {
                survey_id: result.survey_id,
                question_id: question_id,
                response: [],
                metadata: result.metadata,
                created_by: user_id,
              };
            } else {
              data_to_save = {
                survey_id: result.survey_id,
                question_id: question_id,
                response: data.response,
                metadata: result.metadata,
                created_by: user_id,
              };
            }
            let question_data = await Question.findById(question_id).select([
              "title",
              "type_field",
            ]);
            email_body_data.push({
              question_libelle: question_data.title,
              question_field: question_data.type_field,
              response: data.response,
            });
            let answer_save = await Answer.insertOne(data_to_save);
            if (
              question_instance.type_field === "file" &&
              data.response.length > 0
            ) {
              for (const file_name of data.response) {
                let jobData = {
                  file_name,
                  answer_id: answer_save._id,
                };
                saveResponseFileJob(jobData);
              }
            }
          }
        }
      }

      let template = await SurveyTemplate.findById(result.survey_id)
        .populate(["created_by"])
        .populate({
          path: "owner_id",
        })
        .select([
          "title",
          "description",
          "created_by",
          "owner_id",
          "account_type_ref",
        ])
        .exec();

      mailingPug(
        template.owner_id.email,
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
      const { survey_id, start_date, end_date } = data;
      const responses = await getAnswers(survey_id, start_date, end_date);
      return res.status(200).json({
        message: "Données récupérées",
        data: responses,
      });
    } catch (error) {
      next(error);
    }
  };

  const createExcel = async (req, res, next) => {
    try {
      const data = matchedData(req);

      const sheet = await exportExcel(data.survey_id);
      if (sheet) {
        let survey = await SurveyTemplate.findById(data.survey_id).select(
          "title"
        );
        res.setHeader(
          "Content-Disposition",
          `attachment; filename="${survey.title}.xlsx"`
        );
        res.setHeader(
          "Content-Type",
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );

        return res.send(sheet);
      }
      return res.status(500).json({
        message: "Aucune donnée à télécharger",
      });
    } catch (error) {
      next(error);
    }
  };

  const getSurveysStatistics = async (req, res, next) => {
    try {
      const data = matchedData(req);
      const { survey_id, start_date, end_date } = data;

      const responses = await getAnswers(survey_id, start_date, end_date);
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
    updateSurvey,
    duplicateSurvey,
    togglePublishSurvey,
    archiveSurvey,
    deleteSurvey,
    createExcel,
    createSurveyModel,
    createSurveyModelAdmin,
    getSurveysModels,
  };
}
