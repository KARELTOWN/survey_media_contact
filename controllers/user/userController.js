import { validationResult, matchedData } from "express-validator";
import User from "../../models/User.js";
import userService from "../../services/user/userService.js";
import UserCompany from "../../models/UserCompany.js";

const { invitationNotification, getRoles } =
  userService();

export default function userController() {
  const getUsers = async (req, res, next) => {
    try {
      const { limit, page, skip } = req.pagination;
      let query = { company_id: req.ownerId };
      console.log("ownerId", req.ownerId);
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

  const addUserToCompany = async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(422).json({ errors: errors.array() });
      } else {
        const result = matchedData(req);

        const user = await User.findOne({ email: value }).exec();

        let user_company = await UserCompany.insertOne({
          user_id: user._id,
          company_id: req.ownerId,
          role_id: result.role_id,
        });

        user = await user.populate(["role_id"]);

        if (user_company) {
          await invitationNotification(user, req.body.enterprise_data);
          res.status(200).json({
            message: "User add to Company",
            data: {
              user,
            },
          });
        }
      }
    } catch (error) {
      next(error);
    }
  };

  const retireFromCompany = async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (errors.isEmpty()) {
        const data = matchedData(req);

        const user_company = await UserCompany.findOneAndUpdate(
          { _id: data.user_company },
          [{ $set: { is_active: { $not: "$is_active" } } }],
          { new: true }
        );
        if (user_company) {
          console.log(user_company);
          res.status(200).json({
            message: "Modify successfully",
          });
        }
      } else {
        res
          .status(422)
          .json({ message: "Erreur de validation", errors: errors.array() });
      }
    } catch (error) {
      next(error);
    }
  };

  return { getUsers, addUserToCompany, retireFromCompany };
}
