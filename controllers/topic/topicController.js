import { matchedData, validationResult } from "express-validator";
import topicService from "../../services/topic/topicService.js";

import SurveyTemplate from "../../models/SurveyTemplate.js";
import SurveyModel from "../../models/SurveyModel.js";

const { TopicModelFilter, topicCategory, CategoryModelFilter } = topicService();

import Topic from "../../models/Topic.js";
import Category from "../../models/Category.js";

export default function topicController() {
  const createCategory = async (req, res, next) => {
    try {
      const data = matchedData(req);
      let category = new Category({
        ...data,
        created_by: req.user._id,
        owner_id: req.owner_id,
        account_type_ref: req.account_type_ref,
      });
      let new_category = await category.save();

      let topic = await Topic.findById(new_category.topic_id).select('libelle')
      return res.status(200).json({
        message: "Catégorie créé",
        data: {
          category: {
            _id: category._id,
            libelle: category.libelle,
            topic_id: {
              libelle: topic.libelle,
              _id: topic._id
            }
          },
        },
      });
    } catch (error) {
      next(error);
    }
  };

  const createTopic = async (req, res, next) => {
    try {
      const data = matchedData(req);

      let topic = new Topic({
        ...data,
        created_by: req.user._id,
        owner_id: req.owner_id,
        account_type_ref: req.account_type_ref,
      });
      await topic.save();

      return res.status(200).json({
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

      let query = {
        owner_id: req.owner_id,
        account_type_ref: req.account_type_ref,
      };
      const result = await TopicModelFilter(req, query, skip, limit);
      const { total_topic, topic_list } = result;
      data = {
        topics: topic_list,
        total: total_topic,
        page: page,
        limit: limit,
        totalPages: Math.ceil(total_topic / limit),
      };

      return res.status(200).json({
        message: "Topics récupérées",
        data: data,
      });
    } catch (error) {
      next(error);
    }
  };

  const updateTopic = async (req, res, next) => {
    try {
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

      return res.status(200).json({
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

  const getAllCategory = async (req, res, next) => {
    try {
      const { limit, skip, page } = req.pagination;
      let data;

      let query = {
        owner_id: req.owner_id,
        account_type_ref: req.account_type_ref,
      };
      const result = await CategoryModelFilter(req, query, skip, limit);
      const { total_category, category_list } = result;
      data = {
        category: category_list,
        total: total_category,
        page: page,
        limit: limit,
        totalPages: Math.ceil(total_category / limit),
      };

      return res.status(200).json({
        message: "Catégories récupérées",
        data: data,
      });
    } catch (error) {
      next(error);
    }
  };

  const updateCategory = async (req, res, next) => {
    try {
      const data = matchedData(req);
      // vérifier si le topic a changé
      let categoryInstance = await Category.findById(data.category_id).select(
        "topic_id"
      );
      if (categoryInstance.topic_id.toString() !== data.topic_id.toString()) {
        let is_used_in_template = await SurveyTemplate.exists({
          category_id: data.category_id,
        });
        let is_used_in_model = await SurveyModel.exists({
          category_id: data.category_id,
        });
        if (is_used_in_model || is_used_in_template) {
          return res.status(500).json({
            message: "Impossible de modifier la thématique de cette catégorie",
          });
        }
      }
      let category = await Category.findByIdAndUpdate(
        data.category_id,
        {
          libelle: data.libelle,
          topic_id: data.topic_id,
        },
        {
          new: true,
        }
      );
      let topic = await Topic.findById(category.topic_id).select('libelle')

      return res.status(200).json({
        message: "Catégorie modifié",
        data: {
          category: {
            _id: category._id,
            libelle: category.libelle,
            topic_id: {
              libelle: topic.libelle,
              _id: topic._id
            }
          },
        },
      });
    } catch (error) {
      next(error);
    }
  };

  const filterTopics = async (req, res, next) => {
    try {
      const data = matchedData(req);

      const { limit, skip, page } = req.pagination;
      let query = {};

      query.libelle = { $regex: data.search, $options: "i" };
      query.owner_id = req.owner_id;
      query.account_type_ref = req.account_type_ref;

      const result = await TopicModelFilter(req, query, skip, limit);
      const { total_topic, topic_list } = result;

      return res.status(200).json({
        message: "Topics filtrés",
        data: {
          topics: topic_list,
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

  const filterCategory = async (req, res, next) => {
    try {
      const data = matchedData(req);

      const { limit, skip, page } = req.pagination;
      let query = {};

      query.libelle = { $regex: data.search, $options: "i" };
      query.owner_id = req.owner_id;
      query.account_type_ref = req.account_type_ref;

      const result = await CategoryModelFilter(req, query, skip, limit);
      const { total_category, category_list } = result;

      return res.status(200).json({
        message: "Topics filtrés",
        data: {
          category: category_list,
          total: total_category,
          page: page,
          limit: limit,
          totalPages: Math.ceil(total_category / limit),
        },
      });
    } catch (error) {
      next(error);
    }
  };

  const getCategoryInTopic = async (req, res, next) => {
    const data = matchedData(req);
    let topics = await topicCategory(data.topic_id);
    return res.status(200).json({
      message: "Get successfully",
      data: topics,
    });
  };

  const deleteTopic = async (req, res, next) => {
    try {
      let data = matchedData(req);
      let is_used_in_template = await SurveyTemplate.exists({
        topic_id: data.topic_id,
      });
      let is_used_in_model = await SurveyModel.exists({
        topic_id: data.topic_id,
      });
      if (is_used_in_model || is_used_in_template) {
        return res
          .status(500)
          .json({ message: "Thématique utilisée. Impossible à supprimer" });
      } else {
        await Topic.deleteOne({ _id: data.topic_id });
        return res.status(200).json({ message: "Thématique supprimée" });
      }
    } catch (err) {
      next(err);
    }
  };

  const deleteCategory = async (req, res, next) => {
    try {
      let data = matchedData(req);
      let is_used_in_template = await SurveyTemplate.exists({
        category_id: data.category_id,
      });
      let is_used_in_model = await SurveyModel.exists({
        category_id: data.category_id,
      });
      if (is_used_in_model || is_used_in_template) {
        return res
          .status(500)
          .json({ message: "Catégorie déjà utilisée. Impossible à supprimer" });
      } else {
        await Category.deleteOne({ _id: data.category_id });
        return res.status(200).json({ message: "Catégorie supprimée" });
      }
    } catch (err) {
      next(err);
    }
  };

  return {
    createTopic,
    getTopics,
    filterTopics,
    updateTopic,
    getCategoryInTopic,
    getAllCategory,
    createCategory,
    deleteTopic,
    deleteCategory,
    updateCategory,
    filterCategory
  };
}
