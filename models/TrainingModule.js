import { SchemaTypes } from "mongoose";
import mongoose from "../config/mongodb.js";

const TrainingModuleSchema = new mongoose.Schema(
  {
    formation_id: {
      type: SchemaTypes.ObjectId,
      ref: "Formation",
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

const TrainingModule = mongoose.model("TrainingModule", TrainingModuleSchema);
export default TrainingModule;
