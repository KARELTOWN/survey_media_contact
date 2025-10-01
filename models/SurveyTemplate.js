import { SchemaTypes } from "mongoose";
import mongoose from "../config/mongodb.js";
import QuestionTemplateSchema from "./SurveyElementSchema/QuestionTemplateSchema.js";
import moment from "moment";

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
    start_date: {
      type: Date,
      default: () => moment().toDate(),
    },
    end_date: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const SurveyTemplate = mongoose.model("SurveyTemplate", SurveyTemplateSchema);
export default SurveyTemplate;
