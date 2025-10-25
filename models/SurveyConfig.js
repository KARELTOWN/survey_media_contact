import mongoose from "../config/mongodb.js";
import { SchemaTypes } from "mongoose";

const SurveyConfigSchema = new mongoose.Schema(
  {
    logo: {
      type: String,
      required: true,
    },
    owner_id: {
      type: SchemaTypes.ObjectId,
      required: true,
      refPath: "account_type_ref",
      select: false,
    },
    account_type_ref: {
      type: String,
      required: true,
      enum: ["Company", "User"],
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

const SurveyConfig = mongoose.model("SurveyConfig", SurveyConfigSchema);
export default SurveyConfig;
