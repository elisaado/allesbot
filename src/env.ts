import { load } from "@std/dotenv";

const secretKeys = [
  "DISCORD_TOKEN",
  "LASTFM_API_KEY",
  "BEKEND_ROLE_ID",
] as const;

const env = await load({
  export: true,
});

for (const key of secretKeys) {
  if (!env[key]) throw new Error(`\x1b[34mMissing .env variable ${key}\x1b[0m`);
}

console.log("\x1b[34m.env values:\x1b[0m");
for (const entry of Object.entries(env)) {
  console.log(
    `\t${entry[0]}: \x1b[32m"${
      entry[1].substring(0, 5) + ".".repeat(entry[1].length - 5)
    }"\x1b[0m`,
  );
}

export { env };
