import { validationResult, matchedData } from "express-validator";
import User from "../../models/User.js";
import generatePassword from "../../helpers/generatePassword.js";
import userService from "../../services/user/userService.js";
import Direction from "../../models/Direction.js";
import bcrypt from "bcrypt";
import generateUsername from "../../helpers/generateUsername.js";

const {
  newAccountNotification,
  accountStatusNotification,
  getFonctions,
  getRoles,
  getDirections,
} = userService();

export default function userController() {
  const getUsers = async (req, res, next) => {
    try {
      const { limit, page, skip } = req.pagination;
      let users;
      let total_users;
      total_users = await User.countDocuments();
      users = await User.find({})
        .populate(["role_id", "fonction_id", "direction_id"])
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

  const addUser = async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(422).json({ errors: errors.array() });
      } else {
        const result = matchedData(req);
        let password = generatePassword(8);
        const hasckpassword = await bcrypt.hash(password, 10);
        result.password = hasckpassword;
        result.username = await generateUsername(result);

        let user = await User.create({
          ...result,
          fonction_id: result.fonction_id || null,
          email_verified: true,
          is_active: true,
        });
        user = await user.populate(["role_id", "fonction_id", "direction_id"]);

        if (user) {
          await newAccountNotification(user, password);
          res.status(200).json({
            message: "Account create",
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

  const changeAccountStatus = async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (errors.isEmpty()) {
        const data = matchedData(req);

        const user_account = await User.findOne({ _id: data.user_id });

        const user = await User.findOneAndUpdate(
          { _id: data.user_id },
          { is_active: !user_account.is_active },
          { new: true }
        );
        if (user) {
          await accountStatusNotification(user);

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

  const getAccountParams = async (req, res, next) => {
    try {
      const directions = await getDirections();
      const fonctions = await getFonctions();
      const roles = await getRoles();

      res.status(200).json({
        message: "Params get",
        data: {
          directions,
          roles,
          fonctions,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  return { getUsers, addUser, changeAccountStatus, getAccountParams };
}
