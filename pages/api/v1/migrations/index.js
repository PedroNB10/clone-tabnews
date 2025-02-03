
import migrationRunner from 'node-pg-migrate';
import { join } from 'path'
import database from 'infra/database';

export default async function  migrations (request, response){
  console.log('request.method', request.method)
  const dbClient = await database.getNewClient()
  const defaultMigrationOptions = {
      dbClient: dbClient,
      dryRun: true,
      dir: join('infra','migrations'),
      verbose: true,
      direction: 'up',
      migrationsTable: 'pgmigrations'
  }

  if (request.method === 'GET'){
    console.log('ENTROU NO GET')
    const pendingMigrations = await migrationRunner(defaultMigrationOptions)
    console.log(pendingMigrations)

    await dbClient.end()
  return response.status(200).json(pendingMigrations)

  }

  if (request.method === 'POST'){
    console.log('ENTROU NO POST')
    const migratedMigrations = await migrationRunner({
      ...defaultMigrationOptions, 
      dryRun: false // para rodar em live run 
    })
    console.log(migratedMigrations)
    await dbClient.end()


    if (migratedMigrations.length > 0) {
      return response.status(201).json(migratedMigrations)
    }
    else {
      return response.status(200).json(migratedMigrations)
    }


  }

  
  response.status(405).end()

}

