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
  filterTopic,
  updateTopic,
  getCategoryInTopic
} = topicController();
import paginateData from "../../helpers/pagination.js";
import { validatePaginationQuery } from "../../validator/generalValidator.js";
import isauthentificate from "../../middleware/isAuthentificate.js";
import { blacklist } from "../../middleware/blacklist.js";

TopicRouter.post(
  "/create",
  isauthentificate,
  blacklist,
  validateStoreTopic,
  createTopic
);
TopicRouter.get(
  "/get",
  isauthentificate,
  blacklist,
  validatePaginationQuery,
  paginateData,
  getTopics
);

TopicRouter.put(
  "/update/:project_id",
  isauthentificate,
  blacklist,
  validateUpdateTopic,
  updateTopic
);

TopicRouter.post(
  "/filter",
  isauthentificate,
  blacklist,
  validatePaginationQuery,
  paginateData,
  validateFilterTopic,
  filterTopic
);

TopicRouter.get(
  "/category/:topic_id",
  isauthentificate,
  blacklist,
  validateIdTopic,
  getCategoryInTopic
);

export default TopicRouter;
