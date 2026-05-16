import { SchemaTypes } from "mongoose";
import mongoose from "../config/mongodb.js";

const TrainingSessionSchema = new mongoose.Schema(
  {
    formation_id: {
      type: SchemaTypes.ObjectId,
      ref: "Formation",
      required: true,
    },
    libelle: {
      type: String,
      required: true,
      trim: true,
    },
    date_debut: {
      type: Date,
      required: true,
    },
    date_fin: {
      type: Date,
      required: true,
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

const TrainingSession = mongoose.model("TrainingSession", TrainingSessionSchema);
export default TrainingSession;
