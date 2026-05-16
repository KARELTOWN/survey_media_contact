import { connectionRedis } from "./ioredis.js";
import { Worker } from "bullmq";
import fs from "fs";
import mongoose from "../config/mongodb.js";
import { mailTransporter } from "../config/mailer.js";
import fileService from "../services/file/fileService.js";
import { isValidObjectId } from "mongoose";
import _ from "lodash";
const { uploadTempFileOnS3 } = fileService();
import Answer from "../models/Answer.js";

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
      console.log(mailinfo);
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
  { connection: connectionRedis },
);

const uploadResponseFileToS3Worker = new Worker(
  "save_response_file_to_s3",
  async (job) => {
    try {
      let question = job.data;
      const uploadState = await uploadTempFileOnS3(
        question.file_name,
        "survey_reveal/responses",
      );
      if (uploadState !== undefined && isValidObjectId(uploadState)) {
        console.log(`Succès upload du fichier ${question.file_name}`);
        await Answer.findByIdAndUpdate(question.answer_id, {
          $addToSet: { response: uploadState },
        });
      }
    } catch (error) {
      throw new Error(error);
    }
  },
  { connection: connectionRedis },
);
