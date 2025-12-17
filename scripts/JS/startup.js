import { execSync } from "child_process";
import { exec } from "child_process";
import { promisify } from "util";
import { existsSync } from "fs";
import { join } from "path";

const execAsync = promisify(exec);

/**
 * Génère le client Prisma (toujours au démarrage car le code est monté en volume)
 */
function ensurePrismaClient() {
  console.log("🔧 Génération du client Prisma...");
  try {
    execSync("npx prisma generate", { stdio: "inherit" });
    
    // Vérifier que le client a bien été généré
    const prismaClientPath = join(process.cwd(), "node_modules", ".prisma", "client", "index.js");
    if (!existsSync(prismaClientPath)) {
      console.error("❌ Le client Prisma n'a pas été généré correctement");
      return false;
    }
    
    console.log("✅ Client Prisma généré et vérifié !");
    return true;
  } catch (error) {
    console.error("❌ Erreur lors de la génération du client Prisma:", error.message);
    return false;
  }
}

/**
 * Attend que la base de données soit prête
 */
async function waitForDatabase(maxRetries = 30, delay = 2000) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      await execAsync(
        `PGPASSWORD=mobicity_password psql -h db -U mobicity -d mobicity_db -c "SELECT 1" > /dev/null 2>&1`
      );
      return true;
    } catch {
      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        throw new Error("Impossible de se connecter à la base de données");
      }
    }
  }
}

/**
 * Vérifie si la base de données est initialisée
 */
async function isDatabaseInitialized() {
  try {
    const { stdout } = await execAsync(
      `PGPASSWORD=mobicity_password psql -h db -U mobicity -d mobicity_db -tAc "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'users');"`
    );
    return stdout.trim() === "t";
  } catch {
    return false;
  }
}

/**
 * Initialise la base de données si nécessaire
 */
async function initializeDatabase() {
  try {
    await waitForDatabase();
    
    const initialized = await isDatabaseInitialized();
    
    if (!initialized) {
      console.log("📦 Initialisation de la base de données...");
      execSync("npm run initDB", { stdio: "inherit" });
      console.log("✅ Base de données initialisée !");
    }
  } catch (error) {
    console.error("⚠️  Erreur lors de l'initialisation:", error.message);
    console.log("💡 Vous pouvez initialiser manuellement avec: docker-compose exec api npm run initDB");
  }
}

/**
 * Fonction principale
 */
async function main() {
  try {
    // Générer Prisma si nécessaire (critique, doit réussir)
    if (!ensurePrismaClient()) {
      console.error("❌ Impossible de générer le client Prisma");
      process.exit(1);
    }
    
    // Initialiser la DB si nécessaire (non critique, peut échouer)
    try {
      await initializeDatabase();
    } catch (error) {
      console.warn("⚠️  L'initialisation automatique a échoué, mais l'API va démarrer quand même");
      console.log("💡 Initialisez manuellement avec: docker-compose exec api npm run initDB");
    }
    
    console.log("✅ Initialisation terminée");
  } catch (error) {
    console.error("❌ Erreur critique:", error.message);
    process.exit(1);
  }
}

// Toujours exécuter et se terminer avec exit 0 (sauf erreur critique Prisma)
main().then(() => {
  process.exit(0);
}).catch((error) => {
  console.error("❌ Erreur fatale:", error);
  process.exit(1);
});

