import Direction from "../../models/Direction.js";
import Fonction from "../../models/Fonction.js";
import User from "../../models/User.js";

export default function directionService() {
  const DirectionModelFilter = async (req, query, skip = 0, limit = 0) => {
    let direction_finder;
    direction_finder = Direction.find(query);

    let total_directions = await Direction.countDocuments(query);
    let directions;
    if (skip == 0 && limit == 0) {
      directions = await direction_finder
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
      directions = await direction_finder
        .populate({
          path: "created_by",
          model: User,
          select: "firstname lastname",
        })
        .sort({ createdAt: -1 })
        .exec();
    }

    return {
      total_direction: total_directions,
      direction_list: directions,
    };
  };

  const directionData = async (direction_id) => {
    try {
      let direction = await Direction.findById(direction_id)
        .populate({
          path: "created_by",
          model: User,
          select: "firstname lastname",
        })
        .exec();
      return direction;
    } catch (err) {
      throw new Error(err);
    }
  };

  const checkDirectionExist = async (direction_id) => {
    try {
      let exist = await Direction.exists({ _id: direction_id }).exec();
      return exist;
    } catch (err) {
      throw new Error(err);
    }
  };

  const directionFonctions = async (direction_id) => {
    try {
      let fonctions = await Fonction.find({ direction_id: direction_id })
        .populate({
          path: "created_by",
          model: User,
          select: "firstname lastname",
        })
        .exec();
      return fonctions;
    } catch (err) {
      throw new Error(err);
    }
  };

  return {
    checkDirectionExist,
    directionData,
    DirectionModelFilter,
    directionFonctions
  };
}
