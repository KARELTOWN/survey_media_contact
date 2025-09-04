import QuestionFieldType from "../../models/QuestionFieldType.js";
export default function surveyService() {
  const getQuestionFieldTypes = async () => {
    try {
      let field_types = await QuestionFieldType.find({}).exec();
      return field_types;
    } catch (err) {
      throw new Error(err);
    }
  };

  return {
    getQuestionFieldTypes,
  };
}
