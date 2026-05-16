import { mean, mode, modeFast } from "simple-statistics";
import mongoose from "../../config/mongodb.js";
import Answer from "../../models/Answer.js";
import Question from "../../models/Question.js";
import SurveyHistoric from "../../models/SurveyHistoric.js";
import fileService from "../file/fileService.js";
const { getFileOnS3 } = fileService();
import xlsx from "xlsx";
import FileUpload from "../../models/FileUpload.js";
import moment from "moment";
export default function surveyService() {
  const getAnswers = async (survey_id, start, end) => {
    let start_date = start ? moment(start).toDate() : new Date(0);
    let end_date = end ? moment(end).toDate() : moment().toDate();
          console.log('start_date', start_date)
          console.log('end_date', end_date)

    const responses = await Answer.aggregate([
      {
        $match: {
          survey_id: new mongoose.Types.ObjectId(survey_id),
          createdAt: {
            $gte: start_date,
            $lte: end_date,
          },
        },
      },
      {
        $sort: { createdAt: -1 },
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

    for (const response of responses) {
      for (const answer of response.answers) {
        if (answer.question_type_field === "file") {
          if (Array.isArray(answer.response) && answer.response.length > 0) {
            answer.response = await Promise.all(
              answer.response.map(async (fileId) => {
                const file_found = await FileUpload.findById(fileId);
                if (file_found) {
                  const url = await getFileOnS3(file_found.path);
                  return {
                    mimetype: file_found.mimetype,
                    filename: file_found.original_name,
                    encode: url,
                  };
                }
                return null;
              })
            );
            // Supprimer les nulls si nécessaire
            answer.response = answer.response.filter(Boolean);
          }
        }
      }
    }

    return responses;
  };

  const getStatistics = async (responsesGroup, survey_id) => {
    const total_responses = responsesGroup.length;
    const questions = await Question.find({ survey_id: survey_id })
      .select([
        "title",
        "description",
        "type_field",
        "category",
        "field_params",
      ])
      .exec();

    let allAnswers = responsesGroup.map((element) => element.answers);

    let statistics = [];
    for (const question of questions) {
      let statistic = {};
      statistic.question_libelle = question.title;
      let data = getStaticByAnswer(question, allAnswers);
      statistic.nbreResponse = data.countsResponses;
      statistic.responsesOptions = data.responsesOptions;
      statistic.ratingMean = data.ratingMean;
      statistics.push(statistic);
    }

    return { statistics, total_responses };
  };

  const getStaticByAnswer = (question, allAnswers) => {
    let countsResponses = 0;
    let responsesOptions = [];

    if (
      question.type_field == "radio" ||
      question.type_field == "select" ||
      question.type_field == "checkbox"
    ) {
      let options = question.field_params.options;
      for (const option of options) {
        responsesOptions.push({ libelle: option.value, count: 0 });
      }
    }

    let ratingResponses = [];

    if (question.type_field == "review") {
      for (const option of [1, 2, 3, 4, 5]) {
        responsesOptions.push({ libelle: option, count: 0 });
      }
    }

    if (question.type_field == "range") {
      const min = Number(question.field_params?.min ?? 0);
      const max = Number(question.field_params?.max ?? 10);
      const step = Number(question.field_params?.step ?? 1) || 1;
      for (let option = min; option <= max; option += step) {
        responsesOptions.push({ libelle: option, count: 0 });
      }
    }

    for (const answerPerUser of allAnswers) {
      let answers = answerPerUser;
      let answerToQuestion = answers.find(
        (e) => e.question_id == question._id && e.response
      );
      if (answerToQuestion !== undefined) {
        countsResponses++;
        if (question.type_field == "radio") {
          const match = responsesOptions.find(
            (el) => el.libelle === answerToQuestion.response
          );
          if (match && match !== undefined) {
            match.count = (match.count || 0) + 1;
          }
        } else if (question.type_field == "select") {
          const match = responsesOptions.find(
            (el) => el.libelle === answerToQuestion.response
          );
          if (match && match !== undefined) {
            match.count = (match.count || 0) + 1;
          }
        } else if (question.type_field == "checkbox") {
          if (
            Array.isArray(answerToQuestion.response) &&
            answerToQuestion.response.length > 0
          ) {
            for (const select of answerToQuestion.response) {
              const match = responsesOptions.find(
                (el) => el.libelle === select
              );
              if (match && match !== undefined) {
                match.count = (match.count || 0) + 1;
              }
            }
          }
        } else if (question.type_field == "review" || question.type_field == "range") {
          const match = responsesOptions.find(
            (el) => Number(el.libelle) === Number(answerToQuestion.response)
          );
          if (match && match !== undefined) {
            match.count = (match.count || 0) + 1;
          }
          ratingResponses.push(Number(answerToQuestion.response));
        }
      }
    }

    let ratingMean = 0;

    if (
      (question.type_field == "review" || question.type_field == "range") &&
      ratingResponses.length > 0
    ) {
      ratingMean = mean(ratingResponses);
    }

    return { responsesOptions, countsResponses, ratingMean };
  };

  const saveSurveyHistoric = async (survey_template) => {
    try {
      // let data = {
      //   survey_template_id: survey_template._id,
      // };
      // delete survey_template._id;
      // data.template = survey_template;
      // let historic = new SurveyHistoric({ ...data });
      // await historic.save();
    } catch (err) {
      throw new Error(err);
    }
  };

  const exportExcel = async (survey_id) => {
    try {
      let result = await getAnswers(survey_id);
      let answers = [];
      if (Array.isArray(result) && result.length > 0) {
        for (const r of result) {
          let answerPerUser = [];
          if (Array.isArray(r.answers) && r.answers.length > 0) {
            for (const a of r.answers) {
              answerPerUser.push({
                [a.question_label]: a.response,
              });
            }
            const merged = answerPerUser.reduce(
              (acc, obj) => ({ ...acc, ...obj }),
              {}
            );
            answers.push(merged);
          } else {
            continue;
          }
        }
        const worksheet = xlsx.utils.json_to_sheet(answers);
        const workbook = xlsx.utils.book_new();

        xlsx.utils.book_append_sheet(workbook, worksheet, "Feuille 1");

        let buffer = xlsx.write(workbook, {
          type: "buffer",
          bookType: "xlsx",
        });
        return buffer;
      }
      return "";
    } catch (err) {
      throw new Error(err);
    }
  };

  const countSurveyResponse = async (survey_id) => {
    try {
      let count = (await Answer.distinct("created_by", { survey_id })).length;
      return count;
    } catch (err) {
      throw new Error(err);
    }
  };

  return {
    getAnswers,
    getStatistics,
    saveSurveyHistoric,
    exportExcel,
    countSurveyResponse,
  };
}
