import { SchemaTypes } from "mongoose";
import mongoose from "../config/mongodb.js";
import QuestionTemplateSchema from "./SurveyElementSchema/QuestionTemplateSchema.js";
import moment from "moment";
import SurveyThemeSchema from "./SurveyElementSchema/SurveyTheme.js";

const SurveyModelSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    topic_id: {
      type: SchemaTypes.ObjectId,
      ref: "Topic",
      required: true,
    },
    category_id: {
      type: SchemaTypes.ObjectId,
      ref: "Category",
      required: true,
    },
    questions: [QuestionTemplateSchema],
    owner_id: {
      type: SchemaTypes.ObjectId,
      refPath: "account_type_ref",
    },
    account_type_ref: {
      type: String,
      enum: ["Company", "User"],
    },
    multiple_submission: {
      type: Boolean,
      required: true,
      default: true,
    },
    capture_mail: {
      type: Boolean,
      required: true,
      default: false,
    },
    theme: SurveyThemeSchema
  },
  {
    timestamps: true,
  }
);

const SurveyModel = mongoose.model("SurveyModel", SurveyModelSchema);
export default SurveyModel;
