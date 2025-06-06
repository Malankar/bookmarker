import dotenv from "dotenv";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

dotenv.config();

const connectionString = process.env.DATABASE_URL;

const client = postgres(connectionString, { prepare: false });
const db = drizzle(client);

export { client, db };