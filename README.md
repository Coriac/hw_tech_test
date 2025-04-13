# Documentation

[Documentation](./docs/index.html)

# Installation

`docker compose up`

# Points d'API

- GET [localhost:3000/jobs/fetch](localhost:3000/jobs/fetch)
- GET [localhost:3000/jobs/stats](localhost:3000/jobs/stats)

# Choix effectués

## Utilisation de frameworks et packages très communs pour me concentrer sur la partie logique du code

- ExpressJs : Pour passer en API le repo
- Express generator : Pour des raisons d'efficacité. Avec l'option --no-view
- Mongoose : ORM de MongoDB, premier fois que je l'utilise, histoire de découvrir
- Nodemon : Facilité de mise à jour du code
- Axios : Standard de requêtes HTTP
- Dotenv : gestion centralisée par le repo des variables d'environnement
- JsDocs : Pour générer la documentation
- Docker & Docker-compose

## Structure du projet

Structure MVC pour des raisons de cohérence et de relecture du code de mon test technique

## Remarques

### Pas d'utilisation de la pagination de l'API Pole Emploi.

Etant donné la limite de 3149 offres. J'ai préféré utiliser la date comme filtre ainsi qu'un Sort par date de création croissante. Malheureusement, il n'était pas possible de filtrer par date de mise à jour de l'offre.

### Pas d'utilisation du département 75

Je n'ai pas eu le temps de faire spécifiquement la partie parisienne en utilisant le filtre département pour cette ville. Ceci aurait évité un certain nombre de doublons, même si toutefois les doublons ne sont pas sauvés.

# Prochaines étapes

Par manque de temps, je n'ai pas pu faire les étapes suivantes:

- Tests
- Point d'API "flush" (pour vider simplement la base)
- Logs avec niveau de log (potentiellement Winston que j'aimerai découvrir)
- Gestion des erreurs plus fine
- Passage de Paris spécifiquement en département
- Gestion de queue et worker (je suis curieux d'essayer bullMQ)
- Call du point d'API des codes INSEE
- Front avec graphiques (un petit vuejs avec des charts)
