import database from "infra/database.js"

async function  status (request, response){

  const updatedAt = new Date().toISOString()
  const postgresVersion = await database.query('SHOW server_version;')
  const maxConnections = await database.query('SHOW max_connections;');

  const dataBaseName = process.env.POSTGRES_DB

  const connectionsUsed = await database.query({
    text: `SELECT COUNT(*)::int FROM pg_stat_activity WHERE datname = $1;`,
    values: [dataBaseName]
  }); 
  response.status(200).json({
    updated_at: updatedAt,
    dependencies:{
      database:{
        version: postgresVersion.rows[0].server_version,
        max_connections: parseInt(maxConnections.rows[0].max_connections),
        opened_connections: connectionsUsed.rows[0].count
      } 
    }
  })

}

export default status