import { SchemaTypes } from "mongoose";
import mongoose from "../config/mongodb.js";
import { QuestionTemplateSchema } from "./Question.js";

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
      required: true,
    },
    topic: {
      type: SchemaTypes.ObjectId,
      ref: "Topic",
      required: true,
    },
    category: {
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
      default: true
    },
    created_by: {
      type: SchemaTypes.ObjectId,
      ref: "User",
      required: true,
    },
    direction_id: {
      type: SchemaTypes.ObjectId,
      ref: 'Direction',
      required: false
    }
  },
  {
    timestamps: true,
  }
);

const SurveyTemplate = mongoose.model("SurveyTemplate", SurveyTemplateSchema);
export default SurveyTemplate;
