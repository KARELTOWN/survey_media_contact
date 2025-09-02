import mongoose from "../config/mongodb.js";
import { SchemaTypes } from "mongoose";

const QuestionFieldTypeSchema = new mongoose.Schema(
  {
    libelle: {
      type: String,
      unique: [true, 'Le libelle existe déjà'],
      sparse: true,
      required :true
    },
    created_by: {
      type: SchemaTypes.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const QuestionFieldType = mongoose.model("QuestionFieldType", QuestionFieldTypeSchema);
export default QuestionFieldType;
