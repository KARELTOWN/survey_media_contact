import mongoose from "../../config/mongodb.js";

const OptionTemplateSchema = new mongoose.Schema(
  {
    value: { type: String, required: true },
    img: { type: String, required: false },
    default: { type: Boolean, default: false },
  },
  { _id: false }
);
export default OptionTemplateSchema