import mongoose from "../config/mongodb.js";
import { SchemaTypes } from "mongoose";

const ConfigSchema = new mongoose.Schema(
  {
    survey_header: {
      logo: {
        type: String,
        required: true,
      },
      adress: {
        type: String,
        required: true,
      },
      open_hours: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
        required: true,
      },
    },
    header_bg: {
      type: String,
      required: true,
    },
    header_text_color: {
      type: String,
      required: true,
    },
    questions_per_row: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Config = mongoose.model("Config", ConfigSchema);
export default Config;
