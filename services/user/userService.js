import notificationService from "../../services/notification/notificationService.js";
const { sendMailNotification } = notificationService();

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

  return {
    newAccountNotification,
    accountStatusNotification,
  };
}
