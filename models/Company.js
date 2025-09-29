import mongoose from "../config/mongodb.js";
import { SchemaTypes } from "mongoose";

const CompanySchema = new mongoose.Schema(
  {
    denomination: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true
    },
    logo: {
      type: String,
      required: true,
    },
    adress: {
      type: String,
      required: true,
    },
    open_hours: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
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

const Company = mongoose.model("Company", CompanySchema);
export default Company;
