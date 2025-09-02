import LogicOperator from '../../models/LogicOperator.js'
import QuestionFieldType from '../../models/QuestionFieldType.js'
export default function surveyService() {

  const getLogicOperators = async () => {
    try {
      let operators = await LogicOperator.find({})
        .exec();
      return operators;
    } catch (err) {
      throw new Error(err);
    }
  };
  
    const getQuestionFieldTypes = async () => {
    try {
      let field_types = await QuestionFieldType.find({})
        .exec();
      return field_types;
    } catch (err) {
      throw new Error(err);
    }
  };

  return {
    getQuestionFieldTypes,
    getLogicOperators
  };
}
