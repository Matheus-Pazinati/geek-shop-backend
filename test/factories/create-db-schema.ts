import 'dotenv/config'
import sql from "@/database/config-db"

export async function setupTestSchema() {
  await sql`
    CREATE TABLE 
      Users (id uuid DEFAULT public.uuid_generate_v4 (), name VARCHAR(40) NOT NULL, email VARCHAR(50) NOT NULL UNIQUE, password VARCHAR(100) NOT NULL, PRIMARY KEY (id))
  `
}

export async function dropTestSchema() {
  await sql`
    DROP TABLE Users CASCADE
  `
}