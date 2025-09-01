import { SchemaTypes } from "mongoose";
import mongoose from "../config/mongodb.js";

const AnswerSchema = new mongoose.Schema(
  {
    survey_id: {
      type: SchemaTypes.ObjectId,
      ref: "Survey",
      required: true,
    },
    responses: [
      {
        answer_id: String,
        type: String,
        file: String,
        file_type: String,
        options_select: [
          {
            label: String,
            value: String,
          },
        ],
        review: Number,
        text_content: String,
      },
    ],
    metadata: {
      type: Object,
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
