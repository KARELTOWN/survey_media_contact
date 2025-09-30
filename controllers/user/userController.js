import { matchedData } from "express-validator";
import User from "../../models/User.js";
import userService from "../../services/user/userService.js";
import UserCompany from "../../models/UserCompany.js";
import Role from "../../models/Role.js";
import { redisClient } from "../../config/redis.js";

const { invitationNotification } = userService();

export default function userController() {
  const getUsers = async (req, res, next) => {
    try {
      const { limit, page, skip } = req.pagination;
      let query = { company_id: req.owner_id, is_active: true };
      let total_users = await UserCompany.countDocuments(query);

      let users = await UserCompany.find(query)
        .populate(["user_id", "role_id"])
        .select(["user_id", "role_id", "_id", "is_active"])
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec();

      res.status(200).json({
        message: "Utilisateurs récupérés",
        data: {
          users,
          total: total_users,
          page: page,
          limit: limit,
          totalPages: Math.ceil(total_users / limit),
        },
      });
    } catch (error) {
      next(error);
    }
  };

  const addUserCompany = async (req, res, next) => {
    try {
      const result = matchedData(req);
      const user = await User.findOne({ email: result.email }).exec();
      let user_company = await UserCompany.insertOne({
        user_id: user._id,
        company_id: req.owner_id,
        role_id: result.role_id,
        created_by: req.user._id,
      });
      user_company = await user_company.populate(["user_id", "role_id"]);

      let role = await Role.findById(result.role_id).select("libelle");
      if (user_company) {
        await invitationNotification(
          user,
          req.company_data.denomination,
          user_company._id,
          role.libelle
        );
        res.status(200).json({
          message: "User add to Company",
        });
      }
    } catch (error) {
      next(error);
    }
  };

  const retireUserFromCompany = async (req, res, next) => {
    try {
      const data = matchedData(req);

      const user_company = await UserCompany.findOneAndDelete({
        _id: data.user_company,
      });

      if (user_company) {
        res.status(200).json({
          message: "Modify successfully",
          data: {
            self: user_company.user_id.toString() === req.user._id.toString()
          },
        });
      }
      res.status(500).json({
        message: "Rien à supprimer",
      });
    } catch (error) {
      next(error);
    }
  };

  const acceptInvitation = async (req, res, next) => {
    try {
      const user_company = await UserCompany.findOneAndUpdate(
        { _id: req.user_company },
        { is_active: true },
        { new: true }
      );
      if (user_company) {
        const expire = req.expiration - Math.floor(Date.now() / 1000);
        await redisClient.set(req.token, "blacklist", {
          EX: expire,
          NX: true,
        });
        res.status(200).json({
          message: "Invitation accept",
        });
      }
    } catch (error) {
      next(error);
    }
  };

  return {
    getUsers,
    addUserCompany,
    retireUserFromCompany,
    acceptInvitation,
  };
}
