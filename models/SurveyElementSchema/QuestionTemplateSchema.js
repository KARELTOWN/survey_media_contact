import { SchemaTypes } from "mongoose";
import ConditionTemplateSchema from "./ConditionTemplateSchema.js";
import FieldParamsTemplateSchema from "./FieldParamsTemplateSchema.js";
import mongoose from "../../config/mongodb.js";

const QuestionTemplateSchema = new mongoose.Schema({
  question_id: {
    type: String,
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

export default QuestionTemplateSchema;
