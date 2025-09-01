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
      required: true
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
  },
  {
    timestamps: true,
  }
);

const Notification = mongoose.model("Notification", NotificationSchema);
export default Notification;
