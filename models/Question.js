import mongoose from "../../config/mongodb";
import ConditionTemplateSchema from "./SurveyElementSchema/ConditionTemplateSchema";
import FieldParamsTemplateSchema from "./SurveyElementSchema/FieldParamsTemplateSchema";

export const QuestionTemplateSchema = new mongoose.Schema({
  question_id: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  type_field: {
    type: String,
    required: false,
  },
  category: {
    type: String,
    required: true,
  },
  field_libelle: {
    type: String,
    required: false,
  },
  condition: ConditionTemplateSchema,
  field_params: FieldParamsTemplateSchema,
  required: {
    type: Boolean,
    required: true,
  },
});

const Question = mongoose.model("Question", QuestionTemplateSchema);
export default Question;
