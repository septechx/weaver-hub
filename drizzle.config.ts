import "./lib/envConfig.ts";

import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./drizzle",
  schema: "./db/schema.ts",
  dialect: "turso",
  dbCredentials: {
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
  },
});
