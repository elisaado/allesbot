import { z } from "zod";

const envSchema = z.object({
  DISCORD_TOKEN: z.string(),
  LASTFM_API_KEY: z.string(),
  BEKEND_ROLE_ID: z.string(),
  HOUSEMASTER_ID: z.string(),
  FIPO_CHANNEL_ID: z.string(),
  PREFIX: z.string().default("."),
});

const env = envSchema.safeParse(Deno.env.toObject());

if (!env.success) {
  console.error("Invalid environment variables");
  console.error(z.prettifyError(env.error));
  Deno.exit(1);
}

export default env.data;
