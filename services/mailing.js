import pug from "pug";
import { viewspath } from "../index.js";
import path from "path";
import { mailingJob } from "../jobs/queue.js";
import moment from "moment";

const formatTO_DMY = (data) => {
  if (data) {
    return moment(data).format("DD-MM-YYYY");
  }
  return "";
};

const mailingPug = async (email, subject, template, params) => {
  try {
    params.formatTO_DMY = formatTO_DMY;
    const templatePath = path.join(viewspath, template);
    const htmlContent = pug.renderFile(templatePath, params);
    let infos = {
      to: email,
      subject: subject,
      html: htmlContent,
    };
    await mailingJob(infos);
    console.log("Message envoyé");
  } catch (error) {
    console.log("Erreur d'envoi du mail : " + error);
  }
};
export default mailingPug;
