import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import path from "path";
import * as schema from "./schema";

const DB_PATH = process.env.DB_PATH ?? "./espresso.db";

const sqlite = new Database(path.resolve(process.cwd(), DB_PATH));
export const db = drizzle(sqlite, { schema });
