import mongoose from "../config/mongodb.js";
import { SchemaTypes } from "mongoose";

const Roleschema = new mongoose.Schema(
  {
    libelle: {
      type: String,
      unique: [true, "Le role existe déjà"],
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
    },
  },
  {
    timestamps: true,
  }
);

const Role = mongoose.model("Role", Roleschema);
export default Role;
