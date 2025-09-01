import mongoose from "../config/mongodb.js";
import { SchemaTypes } from "mongoose";

const CategorySchema = new mongoose.Schema(
  {
    libelle: {
      type: String,
      required: true,
    },
    topic_id: {
      type: SchemaTypes.ObjectId,
      ref: "Topic",
      required: true,
    },
    created_by: {
      type: SchemaTypes.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

CategorySchema.index({ libelle: 1, topic_id: 1 }, { unique: true });
const Category = mongoose.model("Topic", CategorySchema);
export default Category;
