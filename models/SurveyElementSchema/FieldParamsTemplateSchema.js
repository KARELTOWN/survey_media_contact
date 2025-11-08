import mongoose from "../../config/mongodb.js";
import OptionSchema from "./OptionTemplateSchema.js";
const FieldParamsTemplateSchema = new mongoose.Schema({
  rating: {
    type: String,
    required: false,
    validate: {
      validator: function (value) {
        let val = parseInt(value)
        if (Number.isInteger(val) && val <= 5) {
          return true;
        } else {
          return false;
        }
      },
    },
  },
  accept: {
    type: [String],
    enum: ["video", "excel", "image", "word", "pdf", "powerpoint"],
    required: false,
  },
  max_size: {
    type: Number,
    required: false,
    validate: {
      validator: function (value) {
        if (Number.isInteger(value) && value <= 16) {
          return true;
        } else {
          return false;
        }
      },
    },
  },
  multiple: { type: Boolean, required: false },
  options: [OptionSchema],
  rows: { type: Number, required: false },
  cols: { type: Number, required: false },
  value: { type: String, required: false },
  maxlength: { type: Number, required: false },
  placeholder: { type: String, required: false },
});

export default FieldParamsTemplateSchema;
