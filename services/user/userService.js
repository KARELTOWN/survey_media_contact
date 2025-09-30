import User from "../../models/User.js";
import notificationService from "../../services/notification/notificationService.js";
const { sendMailNotification } = notificationService();
import { encrypt } from "../../helpers/encrypt.js";
import moment from "moment";

export default function userService() {
  const getActiveAccountData = (req) => {
    return {
      owner_id: req.owner_id,
      account_type_ref: req.account_type_ref,
    };
  };

  const invitationNotification = async (
    user,
    enterprise,
    user_company,
    role
  ) => {
    try {
      let token =
        user_company.toString() +
        "@" +
        moment().add("3", "hours").toISOString();
      let encrypt_token = encrypt(token);
      let params = {
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        _id: user._id,
        role: role,
        enterprise: enterprise,
        link: process.env.FRONT_URL + `/join_company?jc=${encrypt_token}`,
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
    getUserData,
  };
}
