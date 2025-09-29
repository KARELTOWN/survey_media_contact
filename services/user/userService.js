import Role from "../../models/Role.js";
import User from "../../models/User.js";
import notificationService from "../../services/notification/notificationService.js";
import companyService from "../company/companyService.js";
const { sendMailNotification } = notificationService();
const { companyData } = companyService();

export default function userService() {
  const newAccountNotification = async (user, password) => {
    try {
      let params = {
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        _id: user._id,
        password: password,
        link: process.env.FRONT_URL,
      };
      await sendMailNotification({
        receivers: [{ ...params }],
        params: params,
        model_name: "NEW_ACCOUNT",
      });
      return true;
    } catch (error) {
      throw new Error(error);
    }
  };

  const getActiveAccountData = (req) => {
    return {
      owner_id: req.ownerId,
      account_type_ref: req.account_type_ref,
    };
  };

  const invitationNotification = async (user, enterprise) => {
    try {
      let params = {
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        _id: user._id,
        role: user.role_id.libelle,
        enterprise: enterprise.denomination,
        link:
          process.env.FRONT_URL + `?user=${user._id}&company=${enterprise._id}`,
      };
      await sendMailNotification({
        receivers: [{ ...params }],
        params: params,
        model_name: "JOIN_COMPANY_INVITATION",
      });
      return true;
    } catch (error) {
      throw new Error(error);
    }
  };

  const accountStatusNotification = async (user) => {
    try {
      let params = {
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        _id: user._id,
        link: process.env.FRONT_URL,
      };
      await sendMailNotification({
        receivers: [{ ...params }],
        params: params,
        model_name:
          user.is_active === true ? "ACTIVATE_ACCOUNT" : "DESACTIVATE_ACCOUNT",
      });
      return true;
    } catch (error) {
      throw new Error(error);
    }
  };

  const getUserData = async (id) => {
    try {
      let user = await User.findById(id);
      return user;
    } catch (err) {
      throw new Error(err);
    }
  };


  return {
    newAccountNotification,
    accountStatusNotification,
    invitationNotification,
    getActiveAccountData
  };
}
