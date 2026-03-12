import { integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const beans = sqliteTable("beans", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  producer: text("producer"),
  region: text("region"),
  varietal: text("varietal"),
  process: text("process"),
  altitude: text("altitude"),
  roast_date: text("roast_date"),
  tasting_notes: text("tasting_notes"),
  created_at: integer("created_at").notNull(),
});

export const shots = sqliteTable("shots", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  bean_id: integer("bean_id").references(() => beans.id),
  dose_g: real("dose_g").notNull(),
  yield_g: real("yield_g").notNull(),
  ratio: real("ratio"),
  duration_s: integer("duration_s").notNull(),
  grind_setting: text("grind_setting"),
  rating: integer("rating"),
  notes: text("notes"),
  created_at: integer("created_at").notNull(),
});

export type Bean = typeof beans.$inferSelect;
export type NewBean = typeof beans.$inferInsert;
export type Shot = typeof shots.$inferSelect;
export type NewShot = typeof shots.$inferInsert;
