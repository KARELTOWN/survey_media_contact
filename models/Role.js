import mongoose from "../config/mongodb.js";
import { SchemaTypes } from "mongoose";

const Roleschema = new mongoose.Schema(
  {
    libelle: {
      type: String,
      required: true,
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
    },
  },
  {
    timestamps: true,
  }
);

Roleschema.index({ libelle: 1, owner_id: 1 }, { unique: true });
const Role = mongoose.model("Role", Roleschema);
export default Role;
