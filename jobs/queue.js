import { Queue } from "bullmq";
import { connectionRedis } from "./ioredis.js";
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

const mailingQueues = queueWorker("mailing");

const saveResponseFileQueues = new Queue("save_response_file_to_s3", {
  defaultJobOptions: { ...defaultOptions, attempts: 2 },
  connection: connectionRedis,
});

export const mailingJob = async (mail_data) => {
  await mailingQueues.add(`send_mail_at_${Date.now()}`, mail_data);
};

export const saveResponseFileJob = async (data) => {
  await saveResponseFileQueues.add(
    `upload_${data.answer_id}_file_to_s3_at_${Date.now()}`,
    data
  );
};
