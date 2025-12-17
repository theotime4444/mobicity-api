# Utiliser une image Node.js officielle avec Alpine (plus légère)
FROM node:20-alpine

# Installer OpenSSL et PostgreSQL client pour Prisma et les vérifications DB
RUN apk add --no-cache openssl libc6-compat postgresql-client

# Définir le répertoire de travail dans le conteneur
WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Configurer Prisma pour générer les binaires Linux
ENV PRISMA_CLI_BINARY_TARGETS=linux-musl-openssl-3.0.x

# Copier le reste des fichiers de l'application
COPY . .

# Copier et rendre exécutable le script d'entrée
COPY entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

# Exposer le port sur lequel l'API écoutera
EXPOSE 3001

# Utiliser le script d'entrée comme point d'entrée
ENTRYPOINT ["/app/entrypoint.sh"]

