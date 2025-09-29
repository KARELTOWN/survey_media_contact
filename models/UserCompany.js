import mongoose from "../config/mongodb.js";
import { SchemaTypes } from "mongoose";

const UserCompanySchema = new mongoose.Schema(
  {
    company_id: {
      type: SchemaTypes.ObjectId,
      ref: "Company",
      required: true,
    },
    user_id: {
      type: SchemaTypes.ObjectId,
      ref: "User",
      required: true,
    },
    role_id: {
      type: SchemaTypes.ObjectId,
      ref: "Role",
      required: true,
    },
    is_active: {
      type: Boolean,
      required: true,
      default: false,
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

const UserCompany = mongoose.model("UserCompany", UserCompanySchema);
export default UserCompany;
