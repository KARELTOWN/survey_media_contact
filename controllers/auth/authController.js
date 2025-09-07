import { validationResult, matchedData } from "express-validator";
import User from "../../models/User.js";
import VerificationCode, {
  verificationType,
} from "../../models/VerificationCode.js";
import PasswordResetToken from "../../models/PasswordResetToken.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import moment from "moment";
import { encrypt, createTokenString, decrypt } from "../../helpers/encrypt.js";
import generateUsername from "../../helpers/generateUsername.js";
import { generateOTP } from "../../helpers/OTPCode.js";
import Role from "../../models/Role.js";
import { redisClient } from "../../config/redis.js";
import authService from "../../services/auth/authService.js";
const {
  registerNotification,
  // confirmRegisterNotification,
  forgotPasswordNotification,
  resetPasswordNotification,
} = authService();

export default function authController() {
  const generateRefreshToken = (user) => {
    const refreshToken = jwt.sign(
      { id: user._id, email: user.email },
      process.env.REFRESH_KEY,
      {
        expiresIn: "30d",
      }
    );
    return refreshToken;
  };

  const refreshToken = async (req, res, next) => {
    try {
      jwt.verify(
        req.body.refreshToken,
        process.env.REFRESH_KEY,
        (err, decoded) => {
          if (err) {
            return res.status(403).json({ message: "Token expiré" });
          }
          const token = jwt.sign(
            { id: decoded.id, email: decoded.email },
            process.env.SECRET_KEY,
            {
              expiresIn: "2h",
            }
          );
          res
            .status(200)
            .json({ message: "Token généré", data: { token: token } });
        }
      );
    } catch (error) {
      next(error);
    }
  };

  const login = async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
      } else {
        const result = matchedData(req);

        const user = await User.findOne({ email: result.email }).select(
          "+password"
        );
        if (!user) {
          return res.status(403).json({ message: "Le compte n'existe pas" });
        } else {
          if (user.email_verified === false) {
            return res.status(403).json({ message: "Compte non vérifié" });
          }
          if (user.is_active === false) {
            return res.status(403).json({ message: "Compte inactif" });
          }

          const confirm = await bcrypt.compare(result.password, user.password);

          if (confirm) {
            const token = jwt.sign(
              {
                id: user._id,
              },
              process.env.SECRET_KEY,
              {
                expiresIn: "2h",
              }
            );
            const refresh_token = generateRefreshToken(user);
            return res.status(200).json({
              message: "Connexion réussie",
              data: {
                token: token,
                data: encrypt(user._id.toString()),
                refreshToken: refresh_token,
              },
            });
          } else {
            return res.status(403).json({ message: "Identifiants invalides" });
          }
        }
      }
    } catch (error) {
      next(error);
    }
  };

  const resendCodeRegistration = async (req, res, next) => {
    try {
      const user_id = req.body.decrypt
      const user = await User.findById(user_id).exec();
      if (!user) {
        return res.status(404).json({ message: "Compte non trouvé" });
      }

      let codeVerification = await VerificationCode.findOne({
        user_id: user._id,
        used_at: { $exists: false },
      }).exec();
      let encodeUserID = encrypt(user._id.toString());

      if (codeVerification && !codeVerification.isExpired()) {
        await registerNotification(user, codeVerification.code, encodeUserID);
      } else if (codeVerification && codeVerification.isExpired()) {
        let lastVerificationCodeTime = moment(codeVerification.createdAt).add(
          "2",
          "minutes"
        );
        let now = moment();

        let morethanTwoMinutes = now.isAfter(lastVerificationCodeTime);
        if (morethanTwoMinutes) {
          let codeOTP = generateOTP();
          await VerificationCode.insertOne({
            user_id: user._id,
            code: codeOTP,
            type: verificationType.register,
            expires_at: moment().add("3", "hours").toDate(),
          });
          await registerNotification(user, codeOTP, encodeUserID);
        } else {
          return res.status(500).json({
            message:
              "Vous devez attendre 2 minutes avant de demander un nouveau code",
          });
        }
      } else if (!codeVerification) {
        return res.status(500).json({
          message: "Votre compte a déjà été validé",
        });
      }

      return res.status(200).json({
        message: "Code resend",
        data: encodeUserID,
      });
    } catch (error) {
      next(error);
    }
  };

  const register = async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
      } else {
        const result = matchedData(req);
        const hasckpassword = await bcrypt.hash(result.password, 10);
        result.password = hasckpassword;
        result.username = await generateUsername(result);
        let codeOTP = generateOTP();

        let role = await Role.findOne({ libelle: "Utilisateur" });

        const user = await User.create({
          ...result,
          role_id: role._id,
        });

        if (user) {
          await VerificationCode.insertOne({
            user_id: user._id,
            code: codeOTP,
            type: verificationType.register,
            expires_at: moment().add("3", "hours").toDate(),
          });

          let encodeUserID = encrypt(user._id.toString());
          await registerNotification(user, codeOTP, encodeUserID);

          return res.status(200).json({
            message: "Account create",
            data: encodeUserID,
          });
        }
      }
    } catch (error) {
      next(error);
    }
  };

  const confirmRegister = async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (errors.isEmpty()) {
        const data = matchedData(req);
        const user_id = decrypt(data.user_id);
        const user = await User.findById(user_id).exec();
        if (!user) {
          return res.status(404).json({ message: "Compte non trouvé" });
        }
        const result = await VerificationCode.findOne({
          user_id: user._id,
          used_at: { $exists: false },
        }).exec();

        if (result) {
          if (result.code !== data.code) {
            return res.status(403).json({
              message: "Le code est invalide",
            });
          } else if (result.isExpired()) {
            return res.status(403).json({
              message: "Le code a expiré. Demander à recevoir un autre code",
            });
          } else {
            let response = await user
              .updateOne({ email_verified: true }, { new: true })
              .exec();
            await result.updateOne({ used_at: moment().toDate() });
            if (response) {
              // await confirmRegisterNotification(user);
              return res.status(200).json({
                message: "Account create",
              });
            }
          }
        } else {
          return res.status(500).json({ message: "Action impossible" });
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

  const forgotPassword = async (req, res, next) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
      } else {
        const data = matchedData(req);
        const { email } = data;
        let user = await User.findOne({ email: email }).exec();
        if (!user) {
          res
            .status(404)
            .json({ message: "Ce email ne semble associé à aucun compte" });
        }
        const resetToken = await PasswordResetToken.findOne({
          user_id: user._id,
          used_at: { $exists: false },
        }).exec();
        if (resetToken) {
          const expired = await resetToken.isExpired();
          if (!expired) {
            return res.status(403).json({
              message: "Un lien de réinitialisation vous a déjà été envoyé",
            });
          }
        }
        let token = createTokenString();
        let toSave = new PasswordResetToken({
          user_id: user._id,
          token: encrypt(token),
          expires_at: moment().add("3", "hours").toDate(),
        });
        let result = await toSave.save();
        const link =
          process.env.FRONT_URL + "/reset-password?" + "urpi=" + token;

        const reject =
          process.env.FRONT_URL +
          "/desapprouve-reinitialisation?" +
          "urpi=" +
          token;

        await forgotPasswordNotification(user, link, reject);

        return res.status(200).json({
          message: "Mail de réinitialisation envoyé",
          data: {},
        });
      }
    } catch (error) {
      next(error);
    }
  };

  const desapprove = async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (errors.isEmpty()) {
        const { token } = matchedData(req);
        const result = await PasswordResetToken.findOne({
          token: encrypt(token),
          used_at: { $exists: false },
        }).exec();
        if (result) {
          const expired = await result.isExpired();
          if (expired) {
            return res.status(403).json({
              message:
                "Lien expiré. Envoyez nous une requête si vous rencontrez un problème avec votre compte",
            });
          } else {
            await result.updateOne({
              expires_at: moment().subtract(3, "hours").toDate(),
            });
            return res.status(200).json({
              message: "Annulation effectuée",
              data: {},
            });
          }
        } else {
          return res.status(403).json({
            message:
              "Le lien de réinitialisation invalide. Envoyez nous une requête si vous rencontrez un problème avec votre compte",
            data: {},
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

  const resetPassword = async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (errors.isEmpty()) {
        const data = matchedData(req);
        const resetToken = await PasswordResetToken.findOne({
          token: encrypt(data.token),
          used_at: { $exists: false },
        }).exec();
        if (resetToken) {
          const user_find = await User.findById(resetToken.user_id)
            .select("+password")
            .exec();
          if (!user_find) {
            return res.status(403).json({
              message: "Compte non trouvé",
            });
          }
          const result = await bcrypt.compare(
            data.password,
            user_find.password
          );
          if (result === true) {
            return res.status(403).json({
              message: "Vous ne pouvez pas utiliser votre ancien mot de passe",
            });
          }

          const expired = await resetToken.isExpired();
          console.log("expired", expired);

          if (expired === true) {
            return res.status(403).json({
              message: "Le lien de réinitialisation a expiré",
            });
          }

          const hashPassword = await bcrypt.hash(data.password, 10);

          const user = await User.findOneAndUpdate(
            { _id: resetToken.user_id },
            { password: hashPassword },
            { new: true }
          );
          if (user) {
            console.log("user", user);
            await resetToken.updateOne({
              used_at: moment().toDate(),
            });

            await resetPasswordNotification(user);

            return res.status(200).json({
              message: "Mot de passe réinitialisé",
              data: user,
            });
          }
          return res.status(403).json({
            message: "Erreur de mise à jour du mot de passe",
            data: user,
          });
        } else {
          return res.status(403).json({
            message: "Le lien de réinitialisation n'est pas valide",
            data: {},
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

  const deconnect = async (req, res, next) => {
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, process.env.SECRET_KEY, async (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: "Token invalide" });
      } else {
        const expire = decoded.exp - Math.floor(Date.now() / 1000);
        await redisClient.set(token, "blacklist", {
          EX: expire, // Blacklist jusqu'à l'expiration réel
          NX: true,
        });
        return res.status(200).json({ message: "Success" });
      }
    });
  };

  return {
    forgotPassword,
    login,
    register,
    refreshToken,
    desapprove,
    resetPassword,
    confirmRegister,
    deconnect,
    resendCodeRegistration,
  };
}
