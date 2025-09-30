import Role from "../../models/Role.js";
import User from "../../models/User.js";
import notificationService from "../../services/notification/notificationService.js";
import companyService from "../company/companyService.js";
const { sendMailNotification } = notificationService();

export default function userService() {
  const getActiveAccountData = (req) => {
    return {
      owner_id: req.ownerId,
      account_type_ref: req.account_type_ref,
    };
  };

  const invitationNotification = async (user, enterprise, user_company) => {
    try {
      let params = {
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        _id: user._id,
        role: user.role_id.libelle,
        enterprise: enterprise.denomination,
        link:
          process.env.FRONT_URL + `?id=${user_company}`,
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

  const getUserData = async (id) => {
    try {
      let user = await User.findById(id);
      return user;
    } catch (err) {
      throw new Error(err);
    }
  };


  return {
    invitationNotification,
    getActiveAccountData,
    getUserData
  };
}
