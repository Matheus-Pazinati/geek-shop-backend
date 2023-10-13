import 'dotenv/config'
import sql from "@/database/config-db"

export async function setupTestSchema(table: 'users' | 'products') {
  if (table == 'users') {
    await sql`
      CREATE TABLE 
        Users (id uuid DEFAULT public.uuid_generate_v4 (), name VARCHAR(40) NOT NULL, email VARCHAR(50) NOT NULL UNIQUE, password VARCHAR(100) NOT NULL, PRIMARY KEY (id))
    `
  } else {
    await sql`
      CREATE TYPE category AS ENUM ('starwars', 'consoles', 'generics')
       CREATE TABLE
        Products (id uuid DEFAULT uuid_generate_v4 (), name VARCHAR(30) NOT NULL UNIQUE, description VARCHAR(60) NOT NULL, price INT NOT NULL, product_category category NOT NULL, image_url VARCHAR(120) NOT NULL, PRIMARY KEY(id))
    `
  }

}

export async function dropTestSchema(table: 'users' | 'products') {
  if (table == 'users') {
    await sql`
      DROP TABLE Users CASCADE
    `
  } else {
    await sql`
      DROP TABLE Products CASCADE
  `
  }

}