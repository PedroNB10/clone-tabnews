import migrationRunner from "node-pg-migrate";
import { join } from "path";
import database from "infra/database";

export default async function migrations(request, response) {
  console.log("request.method", request.method);

  const allowedMethods = ["GET", "POST"];

  if (!allowedMethods.includes(request.method)) {
    return response.status(405).json({
      error: `Method ${request.method} Not Allowed`,
    });
  }

  let dbClient;
  try {
    dbClient = await database.getNewClient();

    const defaultMigrationOptions = {
      dbClient: dbClient,
      dryRun: true,
      dir: join("infra", "migrations"),
      verbose: true,
      direction: "up",
      migrationsTable: "pgmigrations",
    };

    if (request.method === "GET") {
      console.log("ENTROU NO GET");
      const pendingMigrations = await migrationRunner(defaultMigrationOptions);
      console.log(pendingMigrations);

      return response.status(200).json(pendingMigrations);
    }

    if (request.method === "POST") {
      console.log("ENTROU NO POST");
      const migratedMigrations = await migrationRunner({
        ...defaultMigrationOptions,
        dryRun: false, // para rodar em live run
      });
      console.log(migratedMigrations);

      if (migratedMigrations.length > 0) {
        return response.status(201).json(migratedMigrations);
      } else {
        return response.status(200).json(migratedMigrations);
      }
    }
  } catch (error) {
    console.log("error", error);
    throw error;
  } finally {
    await dbClient.end();
  }
}
