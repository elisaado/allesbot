import { load } from "@std/dotenv";

const requiredKeys = [
  "DISCORD_TOKEN",
  "LASTFM_API_KEY",
  "BEKEND_ROLE_ID",
  "HOUSEMASTER_ID",
  "FIPO_CHANNEL_ID",
] as const;

const env = await load();

for (const key of requiredKeys) {
  if (!env[key]) throw new Error(`\x1b[34mMissing .env variable ${key}\x1b[0m`);
}

env.PREFIX = ".";

export default env as Record<
  | "DISCORD_TOKEN"
  | "LASTFM_API_KEY"
  | "BEKEND_ROLE_ID"
  | "HOUSEMASTER_ID"
  | "FIPO_CHANNEL_ID"
  | "PREFIX",
  string
>;

// import { z } from "zod";

// const envSchema = z.object({
//   DISCORD_TOKEN: z.string(),
//   LASTFM_API_KEY: z.string(),
//   BEKEND_ROLE_ID: z.string(),
//   HOUSEMASTER_ID: z.string(),
//   FIPO_CHANNEL_ID: z.string(),
//   PREFIX: z.string().default("."),
// });

// const env = envSchema.safeParse(Deno.env.toObject());

// if (!env.success) {
//   console.error("Invalid environment variables");
//   console.error(z.prettifyError(env.error));
//   Deno.exit(1);
// }

// export default env.data;
