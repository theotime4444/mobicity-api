#!/bin/sh

echo "🚀 Démarrage du conteneur API..."

# Attendre que la base de données soit prête
echo "⏳ Attente de la base de données..."
until pg_isready -h db -U mobicity -d mobicity_db > /dev/null 2>&1; do
  echo "   Base de données non prête, attente de 2 secondes..."
  sleep 2
done
echo "✅ Base de données prête !"

# Toujours générer le client Prisma au démarrage
# (nécessaire car le code est monté en volume et les binaires peuvent manquer)
echo "🔧 Génération du client Prisma..."
npx prisma generate
if [ $? -ne 0 ]; then
  echo "❌ Erreur lors de la génération du client Prisma"
  exit 1
fi
echo "✅ Client Prisma généré !"

# Vérifier si la base de données est déjà initialisée
# On vérifie si la table "users" existe (créée par Prisma)
echo "🔍 Vérification de l'initialisation de la base de données..."
DB_INITIALIZED=$(PGPASSWORD=mobicity_password psql -h db -U mobicity -d mobicity_db -tAc "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'users');" 2>/dev/null || echo "false")

if [ "$DB_INITIALIZED" != "t" ]; then
  echo "📦 Base de données non initialisée, exécution de initDB..."
  npm run initDB
  if [ $? -eq 0 ]; then
    echo "✅ Base de données initialisée avec succès !"
  else
    echo "❌ Erreur lors de l'initialisation de la base de données"
    exit 1
  fi
else
  echo "✅ Base de données déjà initialisée"
fi

# Démarrer l'API
echo "🎯 Démarrage de l'API..."
exec npm run dev

