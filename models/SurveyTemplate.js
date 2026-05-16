import { SchemaTypes } from "mongoose";
import mongoose from "../config/mongodb.js";
import QuestionTemplateSchema from "./SurveyElementSchema/QuestionTemplateSchema.js";
import moment from "moment";
import SurveyThemeSchema from "./SurveyElementSchema/SurveyTheme.js";

const SurveyTemplateSchema = new mongoose.Schema(
  {
    form_id: {
      type: String,
      required: true,
      unique: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    category_id: {
      type: SchemaTypes.ObjectId,
      ref: "Category",
      required: true,
    },
    formation_id: {
      type: SchemaTypes.ObjectId,
      ref: "Formation",
    },
    module_id: {
      type: SchemaTypes.ObjectId,
      ref: "TrainingModule",
    },
    chapter_id: {
      type: SchemaTypes.ObjectId,
      ref: "Chapter",
    },
    trainer_id: {
      type: SchemaTypes.ObjectId,
      ref: "Trainer",
    },
    session_id: {
      type: SchemaTypes.ObjectId,
      ref: "TrainingSession",
    },
    lastEdit: {
      type: Date,
      required: true,
    },
    questions: [QuestionTemplateSchema],
    publish: {
      type: Boolean,
      required: true,
      default: true,
    },
    archived: {
      type: Boolean,
      required: true,
      default: false,
    },
    owner_id: {
      type: SchemaTypes.ObjectId,
      required: true,
      refPath: "account_type_ref",
    },
    account_type_ref: {
      type: String,
      required: true,
      enum: ["Company", "User"],
    },
    created_by: {
      type: SchemaTypes.ObjectId,
      ref: "User",
      required: true,
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
    response_mode: {
      type: String,
      enum: ["anonymous", "identified", "semi_anonymous"],
      default: "anonymous",
    },
    start_date: {
      type: Date,
      default: () => moment().toDate(),
    },
    end_date: {
      type: Date,
    },
    theme: SurveyThemeSchema
  },
  {
    timestamps: true,
  }
);

const SurveyTemplate = mongoose.model("SurveyTemplate", SurveyTemplateSchema);
export default SurveyTemplate;
