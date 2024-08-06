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
  console.error("Make sure to create a .env file with DISCORD_TOKEN");
  process.exit(1);
}

export default env.data;
