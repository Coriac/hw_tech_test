# Étape 1: Utiliser une image Node.js officielle comme base
FROM node:22-slim

# Étape 2: Créer un répertoire de travail pour l'app
WORKDIR /usr/src/app

# Étape 3: Copier package.json et package-lock.json dans le conteneur
COPY package*.json ./

# Étape 4: Installer les dépendances
RUN npm install

# Étape 5: Copier le reste des fichiers du projet dans le conteneur
COPY . .

# Étape 6: Exposer le port que l'app va utiliser
EXPOSE 3000

# Étape 7: Utiliser le script de démarrage défini dans package.json
CMD ["npm", "run", "dev"]
