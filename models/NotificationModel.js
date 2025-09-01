import { SchemaTypes } from "mongoose";
import mongoose from "../config/mongodb.js";
const NotificationModelSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true,
    }
  },
  {
    timestamps: true,
  }
);

const NotificationModel = mongoose.model(
  "NotificationModel",
  NotificationModelSchema
);
export default NotificationModel;
