import { z } from "zod";

const envSchema = z.object({
  DISCORD_TOKEN: z.string(),
  LASTFM_API_KEY: z.string(),
  LASTFM_API_SECRET: z.string(),
});

import "dotenv/config";

let env = envSchema.safeParse(process.env);

if (!env.success) {
  console.error("Invalid environment variables");

  for (const error of env.error.errors) {
    console.error(error.message, error.path);
  }

  process.exit(1);
}

export default env.data;
