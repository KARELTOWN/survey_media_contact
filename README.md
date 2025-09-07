# Application interne d'enquête de satisfaction pour les collaborateurs : SURVEY MC

L'application interne d'enquête de satisfaction pour les collaborateurs, conçu pour
l'Entreprise GROUPE MEDIA CONTACT, permet aux administrateurs de :
- Créer facilement des enquêtes
- Personnaliser entièrement les champs de chaque question (Type de champs :
Réponse courte, Paragraphe, Fichier, Choix Multiple, Avis, Date, Heure ...)
- Configurer la logique d'affichage des champs ou les conditions d'affichage
- Partager le lien de l'enquête sur divers médias sociaux et plateformes
- Gérer les utilisateurs de la plateforme

Les fonctionnalitées de l'application a sa version actuelle (V 1.0) permet de concevoir
les enquêtes et de les partager.

## TECHNOLOGIES

L'application estc conçu avec des technologies modernes qui assurent la rapidité d'exécutions des fonctionnalitées, une meilleure expérience utilisateur et la sécurtié des données

- BACKEND : Réaliser avec **EXPRESS JS**. 
- FRONTEND : Réaliser avec **VUE JS 3** et **TAILWIND CSS**
- BASE DE DONNEES : **MONGO DB**
- AUTRES : **REDIS, BULL MQ**

## SECURITE

### AUTHENTIFICATION
La plateforme est protégée par une authentification. Tout utilisateur doit se connecter en renseignant son adresse email et son mot de passe pour se connecter.

- NB: Le mot de passe doit être fort . Il doit avoir au moins 8 caractères dont 1 caractère MAJUSCULE, 1 caractère MINISCULE, 1 caractère spéciale et 1 chiffre.

IL est permi actuellement de faire un enregistrement sur la plateforme. Mais un compte créé n'est pas directement **actif**. Un administrateur doit nécessairement valider le compte.

**POURQUOI ?**
En effet, la vision est d'avoir une politique de restriction à ces pages, par exemple, en autorisant uniquement des IP étant sur un réseau spécifique.

L'administrateur connecté peut toutefois créer manuellement un compte pour un utilisateur.
Pour ce faire, il doit remplir les informations nécessaires. **La plateforme se charge de créer automatique un mot de passe fort et l'envoie dans le mail du compte créé**

### CRYPTAGE DU MOT DE PASSE

Le mot de passe est crypté en base de données pour assurer qu'il soit illisible.

### UNICITE DES ADRESSES E-MAIL

Deux comptes ne peuvent avoir la même adresse E-mail. L'email est unique.

### VALIDATION NIVEAU FRONTEND

Les formulaires sont validées au niveau du FRONTEND en utilisant **YUP**

### VALIDATION NIVEAU BACKEND

Les informations à stockées sont validées au niveau du BACKEND en utilisant **EXPRESS VALIDATOR**

## NOTIFICATIONS

Des notifications emails sont envoyées sur la plateforme. Un **WORKER et un LISTENER** conçu avec **BULLMQ** permettent de mettre les notifications en queues pour être traitées de manières asynchrones, avec des relances en cas d'échec.


## DEMARRAGE NORMAL

### BASE DE DONNEES MONGO : branch mongo

- Cloner la branch **mongo**
- Avoir **DOCKER INSTALLER**
- Venir dans le répertoire du dossier créé après avoir cloner, puis éxecuter : **docker-compose up -d --build**
- **La base de données est accessible  sur :** http://localhost:8081


### REDIS (Important pour les notifications par mails)

- Avoir **DOCKER INSTALLER**
- Executer : **docker pull redis**
- Executer : **docker run -d -p 6379:6379 redis**

### FRONTEND : BRANCH front

- Cloner la branch **front** : **git clone repository_remote_url**
- Executer : **npm install**
- Executer : **npm run dev**

- **Le frontend démarre sur :** http://localhost:5175

### BACKEND : BRANCH back

- Cloner la branch **back** : **git clone repository_remote_url**
- Executer : **npm install**
- Executer pour démarrer le serveur EXPRESS : **npm run dev**
- Pour l'envoie des notifications email, Exécuter : **npm run worker** puis **npm run listener**

- **Le backend démarre sur :** http://localhost:3001


## DEMARRAGE AVEC DOCKER

- CREER UN DOSSIER **(EXEMPLE SURVEY)** et suivez les instructions suivantes en étant le dossier que vous avez créer
- Cloner la branch **front** : **git clone repository_remote_url**
- Cloner la branch **back** : **git clone repository_remote_url**

- Télécharger le fichier **docker-compose.yaml** et mettez le à la racine du dossier créé **(SURVEY par exemple)** : https://drive.google.com/file/d/1fmhA_MeO-n_kNoh2cOgPGGRyzf8fnoQ6/view?usp=sharing

- **NB** Si vous avez suivi ces instructions , vous devez avoir un dossier contenu à la racine, le fichier **docker-compose.yaml**, le dossier **back** et le dossier **front**

- Maintenant, lancer : **docker-compose up -d --build**

- **Le frontend démarre sur :** http://localhost:5175
- **Le frontend démarre sur :** http://localhost:3001
- **La base de données est accessible  sur :** http://localhost:8081


### VERSION DEMO CLE EN MAIN

L'application est déployée sur un serveur VPS sur lequel est installé **DOCKER**, et **NGINX** pour faire le reverxe proxy

- **Lien frontend**: https://surveymc.bugreveal.com
- **Lien api** : https://api.surveymc.bugreveal.com