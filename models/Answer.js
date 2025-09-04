import { SchemaTypes } from "mongoose";
import mongoose from "../config/mongodb.js";

const AnswerSchema = new mongoose.Schema(
  {
    survey_id: {
      type: SchemaTypes.ObjectId,
      ref: "Survey",
      required: true,
    },
    questions: {
      type: SchemaTypes.ObjectId,
      ref: "Question",
      required: true,
    },
    responses: {
      type: SchemaTypes.Mixed,
      required: true,
    },
    metadata: {
      type: Object,
      required: true,
    },
    created_by: {
      //uniquement si la personne à un compte sur survey MC
      type: SchemaTypes.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const Answer = mongoose.model("Answer", AnswerSchema);
export default Answer;
