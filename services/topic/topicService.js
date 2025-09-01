import Topic from "../../models/Topic.js";
import User from "../../models/User.js";
import Category from "../../models/Category.js";

export default function topicService() {
  const TopicModelFilter = async (req, query, skip = 0, limit = 0) => {
    let topic_finder;
    topic_finder = Topic.find(query);

    let total_topics = await Topic.countDocuments(query);
    let topics;
    if (skip == 0 && limit == 0) {
      topics = await topic_finder
        .populate({
          path: "created_by",
          model: User,
          select: "firstname lastname",
        })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec();
    } else {
      topics = await topic_finder
        .populate({
          path: "created_by",
          model: User,
          select: "firstname lastname",
        })
        .sort({ createdAt: -1 })
        .exec();
    }

    return {
      total_topic: total_topics,
      topic_list: topics,
    };
  };

  const topicData = async (topic_id) => {
    try {
      let topic = await Topic.findById(topic_id)
        .populate({
          path: "created_by",
          model: User,
          select: "firstname lastname",
        })
        .exec();
      return topic;
    } catch (err) {
      throw new Error(err);
    }
  };

  const checkTopicExist = async (topic_id) => {
    try {
      let exist = await Topic.exists({ _id: topic_id }).exec();
      return exist;
    } catch (err) {
      throw new Error(err);
    }
  };

  const topicCategory = async (topic_id) => {
    try {
      let category = await Category.find({ topic_id: topic_id })
        .populate({
          path: "created_by",
          model: User,
          select: "firstname lastname",
        })
        .exec();
      return category;
    } catch (err) {
      throw new Error(err);
    }
  };

  return {
    checkTopicExist,
    topicData,
    TopicModelFilter,
    topicCategory
  };
}
