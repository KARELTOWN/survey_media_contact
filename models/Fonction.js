import mongoose from "../config/mongodb.js";
import { SchemaTypes } from "mongoose";

const FonctionSchema = new mongoose.Schema(
  {
    libelle: {
      type: String,
      required: true,
    },
    is_unique: {
      type: Boolean,
      required: true,
      default: false,
    },
    direction_id: {
      type: SchemaTypes.ObjectId,
      ref: "Direction",
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

FonctionSchema.index({ libelle: 1, direction_id: 1 }, { unique: true });
const Fonction = mongoose.model("Fonction", FonctionSchema);
export default Fonction;
