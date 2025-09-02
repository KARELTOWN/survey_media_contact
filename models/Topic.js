import mongoose from "../config/mongodb.js";
import { SchemaTypes } from "mongoose";

const TopicSchema = new mongoose.Schema(
  {
    libelle: {
      type: String,
      unique: [true, "La thématique existe déjà"],
      sparse: true,
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

const Topic = mongoose.model("Topic", TopicSchema);
export default Topic;