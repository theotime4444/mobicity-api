import { execSync } from "child_process";
import { exec } from "child_process";
import { promisify } from "util";
import { existsSync } from "fs";
import { join } from "path";
import chalk from "chalk";

const execAsync = promisify(exec);

function ensurePrismaClient() {
  console.log(chalk.cyan("[STARTUP] Génération du client Prisma..."));
  try {
    execSync("npx prisma generate", { stdio: "inherit" });
    
    const prismaClientPath = join(process.cwd(), "node_modules", ".prisma", "client", "index.js");
    if (!existsSync(prismaClientPath)) {
      console.error(chalk.red.bold("[STARTUP] Le client Prisma n'a pas été généré correctement"));
      return false;
    }
    
    console.log(chalk.green("[STARTUP] Client Prisma généré et vérifié !"));
    return true;
  } catch (error) {
    console.error(chalk.red.bold("[STARTUP] Erreur lors de la génération du client Prisma:"), error.message);
    return false;
  }
}

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

async function initializeDatabase() {
  try {
    await waitForDatabase();
    
    const initialized = await isDatabaseInitialized();
    
    if (!initialized) {
      console.log(chalk.cyan("[STARTUP] Initialisation de la base de données..."));
      execSync("npm run initDB", { stdio: "inherit" });
      console.log(chalk.green("[STARTUP] Base de données initialisée !"));
    }
  } catch (error) {
    console.error(chalk.yellow("[STARTUP] Erreur lors de l'initialisation:"), error.message);
    console.log(chalk.yellow("[STARTUP] Vous pouvez initialiser manuellement avec: docker compose exec api npm run initDB"));
  }
}

async function main() {
  try {
    if (!ensurePrismaClient()) {
      console.error(chalk.red.bold("[STARTUP] Impossible de générer le client Prisma"));
      process.exit(1);
    }
    
    try {
      await initializeDatabase();
    } catch (error) {
      console.warn(chalk.yellow("[STARTUP] L'initialisation automatique a échoué, mais l'API va démarrer quand même"));
      console.log(chalk.yellow("[STARTUP] Initialisez manuellement avec: docker compose exec api npm run initDB"));
    }
    
    console.log(chalk.green("[STARTUP] Initialisation terminée"));
  } catch (error) {
    console.error(chalk.red.bold("[STARTUP] Erreur critique:"), error.message);
    process.exit(1);
  }
}

main().then(() => {
  process.exit(0);
}).catch((error) => {
  console.error(chalk.red.bold("[STARTUP] Erreur fatale:"), error);
  process.exit(1);
});

