import { connectionRedis } from "./ioredis.js";
import { Worker } from "bullmq";
import fs from "fs";
import mongoose from "../config/mongodb.js";
import { mailTransporter } from "../config/mailer.js";

const mailingWorker = new Worker(
  "mailing",
  async (job) => {
    try {
      let mailinfo = job.data;
      const info = await mailTransporter.sendMail({
        from: process.env.MAIL_FROM,
        to: mailinfo.to,
        subject: mailinfo.subject,
        html: mailinfo.html,
      });
      // if (info) {
      //   await mongoose.model("Notification").insertOne({
      //     mail_to: mailinfo.user_id,
      //     title: mailinfo.subject,
      //     content: mailinfo.html,
      //     notification_model: mailinfo.model,
      //     sendAt: Date.now(),
      //   });
      // }
    } catch (error) {
      throw new Error(error);
    }
  },
  { connection: connectionRedis }
);