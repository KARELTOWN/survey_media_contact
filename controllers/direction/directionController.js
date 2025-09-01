import { matchedData, validationResult } from "express-validator";
import {
  DirectionModelFilter,
  directionFonctions
} from "../../services/direction/directionService.js";
import Direction from "../../models/Direction.js";

export default function directionController() {
  const createDirection = async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(422).json({ errors: errors.array() });
      }
      const data = matchedData(req);
      let direction = new Direction({ ...data, created_by: req.user._id });
      await direction.save();

      res.status(200).json({
        message: "Direction créé",
        data: {
          direction: {
            _id: direction._id,
            libelle: direction.libelle
          },
        },
      });
    } catch (error) {
      next(error);
    }
  };

  const getDirections = async (req, res, next) => {
    try {
      const { limit, skip, page } = req.pagination;
      let data;

      const result = await DirectionModelFilter(req, {}, skip, limit);
      const { total_direction, direction_list } = result;
      data = {
        projects: direction_list,
        total: total_direction,
        page: page,
        limit: limit,
        totalPages: Math.ceil(total_direction / limit),
      };

      res.status(200).json({
        message: "Directions récupérées",
        data: data,
      });
    } catch (error) {
      next(error);
    }
  };

  const updateDirection = async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(422).json({ errors: errors.array() });
      }
      const data = matchedData(req);
      let direction = await Direction.findByIdAndUpdate(
        data.direction_id,
        {
          libelle: data.libelle
        },
        {
          new: true,
        }
      );

      res.status(200).json({
        message: "Direction modifié",
        data: {
          direction: {
            _id: direction._id,
            libelle: direction.libelle,
          },
        },
      });
    } catch (error) {
      next(error);
    }
  };

  const filterDirections = async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(422).json({ errors: errors.array() });
      }
      const data = matchedData(req);

      const { limit, skip, page } = req.pagination;
      let query = {};

      query.libelle = { $regex: data.search, $options: "i" } 

      const result = await DirectionModelFilter(req, query, skip, limit);
      const { total_direction, direction_list } = result;

      res.status(200).json({
        message: "Directions filtrés",
        data: {
          projects: direction_list,
          total: total_direction,
          page: page,
          limit: limit,
          totalPages: Math.ceil(total_direction / limit),
        },
      });
    } catch (error) {
      next(error);
    }
  };

  const getFonctionsInDirection = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(422).json({ errors: errors.array() });
    }
    const data = matchedData(req);
    let fonctions = await directionFonctions(data.direction_id)
    res.status(200).json({
      message: "Get successfully",
      data: fonctions,
    });
  };


  return {
    createDirection,
    getDirections,
    filterDirections,
    updateDirection,
    getFonctionsInDirection,
  };
}
