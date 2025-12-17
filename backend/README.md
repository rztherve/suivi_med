💊 README du Backend (Node.js/Express - TypeScript)
Ceci est le serveur backend de l'application de suivi de médicaments, construit avec Node.js, Express, TypeScript et MongoDB. Il expose une API RESTful et gère l'authentification sécurisée par cookies HttpOnly.

🚀 Démarrage Rapide
1. Prérequis
Node.js (version 18 ou supérieure)

npm ou Yarn

MongoDB (local ou cluster Atlas)

2. Configuration
Créez un fichier .env à la racine du dossier backend/ et ajoutez les variables suivantes :

# URL de connexion à votre base de données MongoDB
MONGO_URI=mongodb://localhost:27017/suivi-medicaments

# Clé secrète pour le JSON Web Token (JWT)
JWT_SECRET=VOTRE_CLE_SECRETE_TRES_LONGUE

# URL de votre frontend (nécessaire pour CORS et les cookies)
FRONTEND_URL=http://localhost:3000 

3. Installation et Lancement
Bash

# Dans le dossier 'backend/'
npm install
npm run dev
Le serveur démarrera sur http://localhost:4000.

🔒 Sécurité et Authentification
L'API utilise l'authentification par token JWT stocké dans un cookie HttpOnly.

Connexion (/auth/login) : Après une connexion réussie, le serveur envoie le token dans un cookie nommé auth_token avec l'attribut HttpOnly=true.

Protection XSS : Grâce à HttpOnly, le token n'est pas accessible via JavaScript, protégeant l'application contre le vol de session par attaques Cross-Site Scripting (XSS).

Déconnexion (/auth/logout) : La déconnexion se fait en demandant au serveur d'effacer le cookie auth_token.

🗺️ Routes de l'API
Toutes les routes sont préfixées par /api.

Méthode	Route	Description	Auth
POST	/auth/register	Créer un nouvel utilisateur	Non
POST	/auth/login	Connexion et émission du cookie auth_token	Non
POST	/auth/logout	Efface le cookie auth_token	Oui
GET	/meds	Liste des médicaments de l'utilisateur	Oui
POST	/meds	Ajouter un médicament	Oui
DELETE	/meds/:id	Supprimer un médicament	Oui
GET	/notifications	Liste des notifications (prises de médicaments planifiées)	Oui
POST	/notifications/:id/done	Marquer une notification comme prise	Oui

