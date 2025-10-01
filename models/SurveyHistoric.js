import moment from "moment";
import mongoose from "../config/mongodb.js";
import { SchemaTypes } from "mongoose";

const SurveyHistoricSchema = new mongoose.Schema({
  survey_template_id: {
    type: SchemaTypes.ObjectId,
    required: true,
  },
  template: {
    type: SchemaTypes.Mixed,
    required: true,
  },
  expired_at: {
    type: Date,
    required: true,
    default: () => moment().add(2, "days").toDate(),
  },
});

const SurveyHistoric = mongoose.model("SurveyHistoric", SurveyHistoricSchema);

export default SurveyHistoric;
