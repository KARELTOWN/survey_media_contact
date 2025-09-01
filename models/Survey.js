import { SchemaTypes } from "mongoose";
import mongoose from "../config/mongodb.js";

let file_type = ["image", "video"];
let logicAction = ["show", "hide"];
const SurveySchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    questions: [
      {
        question_id: {
          type: String,
          unique: true,
          required: true,
        },
        title: String,
        img: String,
        file_link: String,
        file_type: file_type,
        type: {
          type: SchemaTypes.ObjectId,
          required: true,
          ref: "QuestionFieldType",
        },
        options_display: {
          column: Number,
          raw: Number,
        },
        options: [
          {
            label: String,
            value: String,
            img: String,
            default: {
              type: Boolean,
              default: false,
            },
          },
        ],
        required: {
          type: Boolean,
          default: false,
        },
        review: {
          type: Number,
          default: 5,
        },
      },
    ],
    logic: [
      {
        if: {
          question_id: String,
          operator: {
            tpye: SchemaTypes.ObjectId,
            ref: "LogicOperator",
          },
          value: String,
        },
        then: {
          action: logicAction,
          target_question_id: String,
        },
      },
    ],
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
    start_at: {
      type: Date,
      required: true,
      default: Date.now(),
    },
    end_at: {
      type: Date,
      required: true,
    },
    is_active: {
      type: Boolean,
      required: true,
      default: true,
    },
    created_by: {
      type: SchemaTypes.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Survey = mongoose.model("Survey", SurveySchema);
export default Survey;
