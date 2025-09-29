import { SchemaTypes } from "mongoose";
import mongoose from "../config/mongodb.js";
const NotificationSchema = new mongoose.Schema(
  {
    notification_model: {
      type: SchemaTypes.ObjectId,
      ref: "NotificationModel",
      required: true,
    },
    mail_to: {
      type: SchemaTypes.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    sendAt: {
      type: Date,
      required: true,
    },
    readAt: {
      type: Date,
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

const Notification = mongoose.model("Notification", NotificationSchema);
export default Notification;
