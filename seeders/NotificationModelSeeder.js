import NotificationModel from "../models/NotificationModel.js";

async function NotificationModelSeeder() {
  try {
    const notifications = [
      {
        name: "code de vérification de compte",
        title: "Mr/Mrs #firstname #lastname !",
        unique: "CVC",
        content:
          "Votre code de vérification : <strong>#code</strong> <br> Durée d'expiration : 3 heures. Lien de confirmation : #confirmationLink",
      },
      {
        name: "création de compte",
        title: "Bienvenue #firstname #lastname !",
        unique: "NEW_ACCOUNT",
        content:
          "Votre compte <strong>#firstname #lastname</strong> est créé. Votre mot de passe : #password.<br>Vous pouvez maintenant accéder à la plateforme SURVEY MC. <br> Lien de connexion : #link",
      },
      {
        name: "Compte activé",
        title: "Bienvenue #firstname #lastname !",
        unique: "ACTIVATE_ACCOUNT",
        content:
          "Votre compte <strong>#firstname #lastname</strong> est activé.<br>Vous pouvez maintenant accéder à la plateforme SURVEY MC. <br> Lien de connexion : #link",
      },
      {
        name: "Compte désactivé",
        title: "Bienvenue #firstname #lastname !",
        unique: "DESACTIVATE_ACCOUNT",
        content:
          "Votre compte <strong>#firstname #lastname</strong> est désactivé.<br>Rapprochez vous d'un administrateur pour plus d'informations",
      },
      {
        name: "Réinitialisation de mot de passe",
        title: "Mot de passe réinitialisé pour #firstname #lastname",
        unique: "RMP",
        content:
          "Bonjour <strong>#firstname #lastname</strong>,<br>Votre mot de passe a été réinitialisé",
      },
      {
        name: "lien de réinitialisation de mot de passe",
        title: "Réinitialisation du mot de passe pour #firstname #lastname",
        unique: "LRMP",
        content:
          "Bonjour <strong>#firstname #lastname</strong>,<br>Cliquez sur le lien suivant pour réinitialiser votre mot de passe : <a href='#link'>#link</a>. <br> <strong>Durée d'expiration du lien : </strong> 3 heures <br><br> Si vous n'avez pas demandé cette requête de réinitialisation, cliquez sur le lien ci-après <br>  <a href='#reject'>#reject</a>",
      },
      {
        name: "Soumission d'un formulaire",
        title: "Nouvelle soumission",
        unique: "CP",
        content:
          "Le formulaire <strong>#title</strong> a reçu une nouvelle soumission.",
      },
    ];

    let insert = await NotificationModel.insertMany(notifications, {
      ordered: false,
    });
    console.log("Listes des modèles de notifications insérées");
  } catch (error) {
    throw error;
  }
}
export default NotificationModelSeeder;
