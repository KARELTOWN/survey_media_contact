import { SchemaTypes } from "mongoose";
import mongoose from "../config/mongodb.js";

const ConditionTemplateSchema = new mongoose.Schema(
  {
    display: {
      type: String,
      enum: ["hide", "show"],
      required: true, // si obligatoire
    },
    compareTo: {
      type: String,
      required: false,
    },
    operator: {
      type: String,
      enum: ["=", "!=", ">", "<", ">=", "<=", "vide", "rempli"], 
      required: false,
    },
    target: {
      type: String,
      required: false,
    },
  },
  { _id: false } // évite de créer un _id pour chaque condition
);
export default ConditionTemplateSchema;
