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
      topics = await topic_finder.sort({ createdAt: -1 }).exec();
    } else {
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

  const checkCategoryExist = async (category_id) => {
    try {
      let exist = await Category.exists({ _id: category_id }).exec();
      return exist;
    } catch (err) {
      throw new Error(err);
    }
  };

  const topicCategory = async (topic_id, req = null) => {
    try {
      let query = {};
      if (topic_id) {
        query.topic_id = topic_id;
      }
      if (req) {
        query.owner_id = req.owner_id;
        query.account_type_ref = req.account_type_ref;
      }
      let category = await Category.find(query).sort({ createdAt: -1 }).exec();
      return category;
    } catch (err) {
      throw new Error(err);
    }
  };

  const CategoryModelFilter = async (req, query, skip = 0, limit = 0) => {
    let categ_finder;
    categ_finder = Category.find(query);

    let total_category = await Category.countDocuments(query);
    let category;
    if (skip == 0 && limit == 0) {
      category = await categ_finder.sort({ createdAt: -1 }).exec();
    } else {
      category = await categ_finder
        .select(["-account_type_ref", "-created_by"])
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec();
    }

    return {
      total_category: total_category,
      category_list: category,
    };
  };

  return {
    checkTopicExist,
    topicData,
    TopicModelFilter,
    topicCategory,
    checkCategoryExist,
    CategoryModelFilter,
  };
}
