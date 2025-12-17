📱 README du Frontend (React/Vite - TypeScript)
Ceci est le client web de l'application de suivi de médicaments, construit avec React et TypeScript, et utilisant Vite.

🚀 Démarrage Rapide
1. Prérequis
Le Backend doit être en cours d'exécution sur http://localhost:4000.

2. Installation et Lancement
Bash

# Dans le dossier 'frontend/'
npm install
npm run dev
L'application sera accessible sur http://localhost:3000 (ou un autre port par défaut de Vite).

⚙️ Configuration de l'API
Le fichier src/services/api.ts est configuré pour communiquer avec le backend en utilisant l'URL de base : http://localhost:4000/api.

Sécurité (Cookies) :
Toutes les requêtes vers l'API sont effectuées avec l'option credentials: 'include' dans fetch. Ceci est obligatoire pour que le navigateur envoie et reçoive le cookie HttpOnly géré par le backend.

🔒 Flux d'Authentification
Connexion (/login) :

Le frontend envoie les identifiants à POST /api/auth/login.

Le navigateur reçoit le cookie auth_token (HttpOnly).

L'application redirige vers /dashboard.

Accès Protégé (/dashboard) :

Le Dashboard appelle immédiatement l'API (/meds, /notifications).

Le navigateur envoie automatiquement le cookie auth_token.

Si le token est valide (200 OK), les données sont chargées.

Si le token est manquant ou invalide (401 Unauthorized), le Dashboard gère l'erreur et redirige vers /login.


Déconnexion (Se déconnecter) :

L'application appelle POST /api/auth/logout.
Le serveur efface le cookie, mettant fin à la session.
L'utilisateur est redirigé vers /login.

🧩 Composants Clés
Login.tsx / Register.tsx : Gèrent l'authentification et les redirections initiales.

Dashboard.tsx : Point d'entrée principal pour l'utilisateur, gère l'état global des médicaments et des notifications, et contient la logique de redirection en cas d'échec d'authentification (401).

src/services/api.ts : Couche d'abstraction centrale pour toutes les requêtes HTTP, garantissant l'utilisation des credentials.