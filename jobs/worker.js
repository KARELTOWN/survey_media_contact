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

// const feedbackStore = new Worker(
//   "feedback",
//   async (job) => {
//     try {
//       let paths = [];

//       let decodedFile = null;
//       // DECODER LES DONNES EN BUFFER
//       let bufferFile = await readFileFromFolder(job.data.file.path);
//       decodedFile = { ...job.data.file, buffer: bufferFile };
//       paths.push(decodedFile.path);

//       let decodedAttachments = [];
//       if (job.data.attachments.length > 0) {
//         for (const attach of job.data.attachments) {
//           let bufferFile = await readFileFromFolder(attach.path);
//           decodedAttachments.push({ ...attach, buffer: bufferFile });
//           paths.push(attach.path);
//         }
//       }

//       const fileResult = await uploadFileOnS3(
//         decodedFile,
//         job.data.feedback.project_id
//       );
//       let attachmentsResult = [];
//       if (job.data.attachments.length > 0) {
//         attachmentsResult = await uploadFilesOnS3(
//           decodedAttachments,
//           job.data.feedback.project_id
//         );
//       }
//       if (fileResult) {
//         if (attachmentsResult.length === job.data.attachments.length) {
//           const statusOpen = await FeedbackStatus.findOne({
//             libelle: "Ouvert",
//           }).exec();

//           job.data.feedback.metadata = {
//             user_agent: job.data.feedback.user_agent,
//             width: job.data.feedback.width,
//             height: job.data.feedback.height,
//           };

//           let feedbackFile = await Files.insertOne(fileResult);

//           const feedback = await Feedback.create({
//             ...job.data.feedback,
//             status: statusOpen._id,
//             file: feedbackFile._id,
//           });

//           let filesAttach = [];
//           for (const element of attachmentsResult) {
//             filesAttach.push({
//               key: element.key,
//               feedback_id: feedback._id,
//               name: element.name,
//               type: element.type,
//               size: element.size,
//             });
//           }

//           await Files.insertMany(filesAttach);

//           await createFeedbackNotification(feedback._id);
//           deleteFiles(paths);

//           console.log("Feedback enregistré");
//         }
//       }
//     } catch (error) {
//       throw new Error(error);
//     }
//   },
//   { connection: connectionRedis }
// );
