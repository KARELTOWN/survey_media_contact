import mongoose from "../config/mongodb.js";
import { SchemaTypes } from "mongoose";

const TopicSchema = new mongoose.Schema(
  {
    libelle: {
      type: String,
      unique: [true, "La thématique existe déjà"],
      sparse: true,
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

const Topic = mongoose.model("Topic", TopicSchema);
export default Topic;
