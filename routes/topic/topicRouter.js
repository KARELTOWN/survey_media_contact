import express from "express";
const TopicRouter = express.Router();
import {
  validateStoreTopic,
  validateIdTopic,
  validateUpdateTopic,
  validateFilterTopic,
} from "../../validator/topic/topicValidator.js";

import topicController from "../../controllers/topic/topicController.js";

const {
  createTopic,
  getTopics,
  filterTopics,
  updateTopic,
  getCategoryInTopic
} = topicController();
import paginateData from "../../helpers/pagination.js";
import { validatePaginationQuery } from "../../validator/generalValidator.js";

TopicRouter.post(
  "/create",
  validateStoreTopic,
  createTopic
);
TopicRouter.get(
  "/get",
  validatePaginationQuery,
  paginateData,
  getTopics
);

TopicRouter.put(
  "/update/:project_id",
  validateUpdateTopic,
  updateTopic
);

TopicRouter.post(
  "/filter",
  validatePaginationQuery,
  paginateData,
  validateFilterTopic,
  filterTopics
);

TopicRouter.get(
  "/category/:topic_id",
  validateIdTopic,
  getCategoryInTopic
);

export default TopicRouter;
