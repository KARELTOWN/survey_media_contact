import { SchemaTypes } from "mongoose";
import mongoose from "../config/mongodb.js";

const ChapterSchema = new mongoose.Schema(
  {
    module_id: {
      type: SchemaTypes.ObjectId,
      ref: "TrainingModule",
      required: true,
    },
    nom: {
      type: String,
      required: true,
      trim: true,
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
  },
  {
    timestamps: true,
  }
);

const Chapter = mongoose.model("Chapter", ChapterSchema);
export default Chapter;
