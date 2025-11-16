import { z } from "zod";

const envSchema = z.object({
  DISCORD_TOKEN: z.string(),
  LASTFM_API_KEY: z.string(),
  LASTFM_API_SECRET: z.string(),
  BEKEND_ROLE_ID: z.string(),
});

const env = envSchema.safeParse(Deno.env);

if (!env.success) {
  console.error("Invalid environment variables");

  for (const error of env.error.errors) {
    console.error(error.message, error.path);
  }

  Deno.exit(1);
}

const envData = env.data;

export { envData as env };
