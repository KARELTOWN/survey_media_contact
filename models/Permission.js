import { SchemaTypes } from "mongoose";
import mongoose from "../config/mongodb.js";
const PermissionSchema = new mongoose.Schema(
  {
    module_id: {
      type: SchemaTypes.ObjectId,
      ref: "Module",
      required: true,
    },
    feature_id: {
      type: SchemaTypes.ObjectId,
      ref: "Feature",
      required: true,
    },
    role_id: {
      type: SchemaTypes.ObjectId,
      ref: "Role",
      required: true,
    },
    is_active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Permission = mongoose.model("Permission", PermissionSchema);
export default Permission;
