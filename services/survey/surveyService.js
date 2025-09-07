import { mean, mode, modeFast } from "simple-statistics";
import mongoose from "../../config/mongodb.js";
import Answer from "../../models/Answer.js";
import Question from "../../models/Question.js";

export default function surveyService() {
  const getAnswers = async (survey_id) => {
    const responses = await Answer.aggregate([
      {
        $match: {
          survey_id: new mongoose.Types.ObjectId(survey_id),
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
        } else if (question.type_field == "review") {
          const match = responsesOptions.find(
            (el) => el.libelle === answerToQuestion.response
          );
          if (match && match !== undefined) {
            match.count = (match.count || 0) + 1;
          }
          ratingResponses.push(answerToQuestion.response);
        }
      }
    }

    let ratingMean = 0;

    if (question.type_field == "review" && ratingResponses.length > 0) {
      ratingMean = mean(ratingResponses);
    }

    return { responsesOptions, countsResponses, ratingMean };
  };

  return {
    getAnswers,
    getStatistics,
  };
}
