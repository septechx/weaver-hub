import { sqliteTable, text, int } from "drizzle-orm/sqlite-core";

export const weavesTable = sqliteTable("weaves", {
  id: text().primaryKey(),
  name: text().notNull(),
  data: text({ mode: "json" }).notNull(),
  preview: text(),
  updatedAt: int({ mode: "timestamp_ms" }).notNull(),
});
