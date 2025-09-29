import mongoose from "../config/mongodb.js";
import { SchemaTypes } from "mongoose";

const SurveyConfigSchema = new mongoose.Schema(
  {
    logo: {
      type: String,
      required: true,
    },
    adress: {
      type: String,
      required: function () {
        return this.account_type_ref === "enterprise";
      },
    },
    open_hours: {
      type: String,
      required: function () {
        return this.account_type_ref === "enterprise";
      },
    },
    phone: {
      type: String,
      required: true,
    },
    header_bg: {
      type: String,
    },
    header_text_color: {
      type: String,
    },
    questions_per_row: {
      type: String,
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
