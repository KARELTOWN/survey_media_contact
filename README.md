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

## NOTIFICATIONS

Des notifications emails sont envoyées sur la plateforme. Un **WORKER et un LISTENER** conçu avec **BULLMQ** permettent de mettre les notifications en queues pour être traitées de manières asynchrones, avec des relances en cas d'échec.


## INSTALLATION

### BASE DE DONNEES MONGO : branch mongo
- Installer **DOCKER** et **DOCKER COMPOSE**
- Cloner la branch **mongo**
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
- Lancer les seeders: **npm run db:seed**
- Executer pour démarrer le serveur : **npm run dev**
- Pour l'envoie des notifications email, Exécuter : **npm run worker** puis **npm run listener**

- **Le backend démarre sur :** http://localhost:3001


## INSTALLATION AVEC DOCKER COMPOSE (PLUS SIMPLE)

- Installer **DOCKER** et **DOCKER COMPOSE**
- CREER UN DOSSIER PARENT **(EXEMPLE SURVEY)** et suivez les instructions suivantes en étant le dossier que vous avez créer
- Cloner la branch **front** : **git clone repository_remote_url**
- Cloner la branch **back** : **git clone repository_remote_url**

- Télécharger le fichier **docker-compose.yaml** et mettez le à la racine du dossier créé **(SURVEY par exemple)** : https://drive.google.com/file/d/1fmhA_MeO-n_kNoh2cOgPGGRyzf8fnoQ6/view?usp=sharing

- **NB** Si vous avez suivi ces instructions , vous devez avoir un dossier parent, contenant : le fichier **docker-compose.yaml**, le dossier **back** et le dossier **front**

- A la racine du dossier parent, lancer : **docker-compose up -d --build**

- **Le frontend démarre sur :** http://localhost:5175
- **Le frontend démarre sur :** http://localhost:3001
- **La base de données est accessible  sur :** http://localhost:8082