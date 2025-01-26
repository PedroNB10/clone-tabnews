test("GET to /api/v1/status should returns 200", async () => {

  const response = await fetch("http://localhost:3000/api/v1/status")
  
  expect(response.status).toBe(200)

  const responseBody = await response.json()
  console.log(responseBody)

  expect(responseBody.updated_at).toBeDefined()

  expect(responseBody.dependencies.database.version).toBe("16.0")
  expect(responseBody.dependencies.database.max_connections).toBe(100)
  expect(responseBody.dependencies.database.opened_connections).toBe(1)



} );

// test.only(" Test Injection SQL", async () => {
  
//   // await fetch("http://localhost:3000/api/v1/status?databaseName=local_db")
//   await fetch("http://localhost:3000/api/v1/status?databaseName='; SELECT pg_sleep(4); --")
//   // isso resulta em SELECT COUNT(*)::int FROM pg_stat_activity WHERE datname = ''; SELECT pg_sleep(4); --'; SQL Injection

// })