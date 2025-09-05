import { SchemaTypes } from "mongoose";
import mongoose from "../config/mongodb.js";

const SurveySchema = new mongoose.Schema(
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
    publish: {
      type: Boolean,
      required: true,
      default: true,
    },
    created_by: {
      type: SchemaTypes.ObjectId,
      ref: "User",
      required: true,
    },
    direction_id: {
      type: SchemaTypes.ObjectId,
      ref: "Direction",
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const Survey = mongoose.model("Survey", SurveySchema);
export default Survey;
