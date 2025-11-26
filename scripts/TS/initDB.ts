import { prisma } from "../../src/database/databaseORM.ts";
import fs from "fs";
import path from "path";
import csv from "csv-parser";
import 'dotenv/config'; 

async function initDB() {
  const sqlFilePath = path.join(__dirname, "../SQL/initDB.sql");
  const sql = fs.readFileSync(sqlFilePath, "utf-8");

  const statements = sql
    .split(";")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  for (const statement of statements) {
    await prisma.$executeRawUnsafe(statement);
  }
}

async function importCsv(filePath: string, category : number) {

  const rows: any[] = [];
  await new Promise<void>((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (data) => rows.push(data))
      .on("end", () => resolve())
      .on("error", reject);
  });

  for (const row of rows) {
    const stopName = row.stop_name.trim();
    const lat = parseFloat(row.stop_lat);
    const lon = parseFloat(row.stop_lon);

    await prisma.$queryRaw`
      INSERT INTO "transport_location" ("name", "category_id", "coord")
      VALUES 
      (${stopName}, ${category}, ST_SetSRID(ST_MakePoint(${lon}, ${lat}), 4326))`;
  }
  
  console.log("Transport locations inserted:", rows.length);
}

async function main() {
  await initDB();
  await importCsv(path.join(__dirname, "../data/stops_train.csv"), 1);
  await importCsv(path.join(__dirname, "../data/stops_bus.csv"), 2);
}

main()
  .catch(console.error)
  .finally(async () => await prisma.$disconnect());