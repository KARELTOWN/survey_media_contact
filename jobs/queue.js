import { Queue } from "bullmq";
import { connectionRedis } from "./ioredis.js";
import { performance } from "perf_hooks";
const defaultOptions = {
  attempts: 5,
  backoff: { type: "fixed", delay: 10000 },
  removeOnComplete: true,
  ttl: 1000 * 60 * 60 * 24 * 15,
};

function queueWorker(queueName) {
  return new Queue(queueName, {
    defaultJobOptions: defaultOptions,
    connection: connectionRedis,
  });
}

const surveyResponseQueues = queueWorker("survey_response");
const mailingQueues = queueWorker("mailing");

export const storeSurveyResponse = async (data) => {
  try {
    let attachments = Array.from(data.attachments);
    await surveyResponseQueues.add(`survey_response_${Date.now()}`, {
      file: data.file,
      attachments: attachments,
      feedback: data.feedback,
    });
  } catch (error) {
    throw new Error(error);
  }
};

export const mailingJob = async (mail_data) => {
  await mailingQueues.add(`send_mail_at_${Date.now()}`, mail_data); // ajout un à un mais performant
};