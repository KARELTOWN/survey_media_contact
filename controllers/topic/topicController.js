import { matchedData, validationResult } from "express-validator";
import {
  TopicModelFilter,
  topicCategory,
} from "../../services/topic/topicService.js";
import Topic from "../../models/Topic.js";

export default function topicController() {
  const createTopic = async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(422).json({ errors: errors.array() });
      }
      const data = matchedData(req);
      let topic = new Topicopic({ ...data, created_by: req.user._id });
      await topic.save();

      res.status(200).json({
        message: "Topic créé",
        data: {
          topic: {
            _id: topic._id,
            libelle: topic.libelle,
          },
        },
      });
    } catch (error) {
      next(error);
    }
  };

  const getTopics = async (req, res, next) => {
    try {
      const { limit, skip, page } = req.pagination;
      let data;

      const result = await TopicModelFilter(req, {}, skip, limit);
      const { total_topic, topic_list } = result;
      data = {
        projects: topic_list,
        total: total_topic,
        page: page,
        limit: limit,
        totalPages: Math.ceil(total_topic / limit),
      };

      res.status(200).json({
        message: "Topics récupérées",
        data: data,
      });
    } catch (error) {
      next(error);
    }
  };

  const updateTopic = async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(422).json({ errors: errors.array() });
      }
      const data = matchedData(req);
      let topic = await Topic.findByIdAndUpdate(
        data.topic_id,
        {
          libelle: data.libelle,
        },
        {
          new: true,
        }
      );

      res.status(200).json({
        message: "Topic modifié",
        data: {
          topic: {
            _id: topic._id,
            libelle: topic.libelle,
          },
        },
      });
    } catch (error) {
      next(error);
    }
  };

  const filterTopics = async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(422).json({ errors: errors.array() });
      }
      const data = matchedData(req);

      const { limit, skip, page } = req.pagination;
      let query = {};

      query.libelle = { $regex: data.search, $options: "i" };

      const result = await TopicModelFilter(req, query, skip, limit);
      const { total_topic, topic_list } = result;

      res.status(200).json({
        message: "Topics filtrés",
        data: {
          projects: topic_list,
          total: total_topic,
          page: page,
          limit: limit,
          totalPages: Math.ceil(total_topic / limit),
        },
      });
    } catch (error) {
      next(error);
    }
  };

  const getCategoryInTopic = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(422).json({ errors: errors.array() });
    }
    const data = matchedData(req);
    let topics = await topicCategory(data.topic_id);
    res.status(200).json({
      message: "Get successfully",
      data: topics,
    });
  };

  return {
    createTopic,
    getTopics,
    filterTopics,
    updateTopic,
    getCategoryInTopic,
  };
}
