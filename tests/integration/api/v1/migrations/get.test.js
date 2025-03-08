import database from "infra/database";
import orchestrator from "tests/orchestrator";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await database.query("drop schema public cascade; create schema public;");
});

test("GET to /api/v1/migrations should returns 200", async () => {
  // console.log('process.env.NODE_ENV: ',process.env.NODE_ENV)
  // console.log('process.env.DATABASE_URL: ',process.env.DATABASE_URL)

  const response = await fetch("http://localhost:3000/api/v1/migrations");

  expect(response.status).toBe(200);

  const responseBody = await response.json();

  expect(Array.isArray(responseBody)).toBe(true);
  expect(responseBody.length).toBeGreaterThan(0);
});

// test.only(" Test Injection SQL", async () => {

//   // await fetch("http://localhost:3000/api/v1/status?databaseName=local_db")
//   await fetch("http://localhost:3000/api/v1/status?databaseName='; SELECT pg_sleep(4); --")
//   // isso resulta em SELECT COUNT(*)::int FROM pg_stat_activity WHERE datname = ''; SELECT pg_sleep(4); --'; SQL Injection

// })
