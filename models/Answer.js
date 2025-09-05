import { SchemaTypes } from "mongoose";
import mongoose from "../config/mongodb.js";

const AnswerSchema = new mongoose.Schema(
  {
    survey_id: {
      type: SchemaTypes.ObjectId,
      ref: "Survey",
      required: true,
    },
    question_id: {
      type: SchemaTypes.ObjectId,
      ref: "Question",
      required: true,
    },
    response: {
      type: SchemaTypes.Mixed,
      required: true,
    },
    metadata: {
      type: Object,
      required: true,
    },
    created_by: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Answer = mongoose.model("Answer", AnswerSchema);
export default Answer;
