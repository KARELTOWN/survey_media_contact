import { SchemaTypes } from "mongoose";
import mongoose from "../config/mongodb.js";
import ConditionTemplateSchema from "./SurveyElementSchema/ConditionTemplateSchema.js";
import FieldParamsTemplateSchema from "./SurveyElementSchema/FieldParamsTemplateSchema.js";

const QuestionSchema = new mongoose.Schema({
  _id: {
    type: String,
    unique: true,
    required: true
  },
  survey_id: {
    type: SchemaTypes.ObjectId,
    ref: "Survey",
    required: true,
  },
  img: { type: String, required: false },

  title: {
    type: String,
    validate: {
      validator: function (value) {
        // Si category !== "image", alors "required" doit être défini (true ou false explicite)
        if (this.category !== "image") {
          return value !== undefined && value !== null;
        }
        // Si category === "image", pas de contrainte
        return true;
      },
      message:
        'Le champ "required" est obligatoire sauf si category = "image".',
    },
  },
  description: {
    type: String,
    required: false,
  },
  type_field: {
    type: String,
    required: false,
  },
  category: {
    type: String,
    required: true,
  },
  field_libelle: {
    type: String,
    required: false,
  },
  condition: ConditionTemplateSchema,
  field_params: FieldParamsTemplateSchema,
  required: {
    type: Boolean,
    validate: {
      validator: function (value) {
        // Si category !== "image", alors "required" doit être défini (true ou false explicite)
        if (this.category !== "image") {
          return value !== undefined && value !== null;
        }
        // Si category === "image", pas de contrainte
        return true;
      },
      message:
        'Le champ "required" est obligatoire sauf si category = "image".',
    },
  },
});

const Question = mongoose.model("Question", QuestionSchema);
export default Question;
