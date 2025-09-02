import mongoose from "../config/mongodb.js";
import { SchemaTypes } from "mongoose";

const LogicOperatorSchema = new mongoose.Schema(
  {
    libelle: {
      type: String,
      unique: [true, 'L\'opérateur existe déjà'],
      sparse: true,
      required :true
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

const LogicOperator = mongoose.model("LogicOperator", LogicOperatorSchema);
export default LogicOperator;
