import { client } from "./client.ts";
import { env } from "./env.ts";
import { type BotEvent, botEventGuard } from "./types.ts";

const eventFiles = Deno
  .readDirSync("src/events")
  .filter((file) => file.name.endsWith(".ts"));

for (const eventFile of eventFiles) {
  const module = await import(`./events/${eventFile.name}`) as object;

  for (const [name, entry] of Object.entries(module)) {
    if (!botEventGuard(entry)) {
      console.warn(
        `[WARNING] The export ${name} in module ${eventFile.name} doesn't really look like an event..`,
      );

      continue;
    }

    const event = entry as BotEvent;

    if (event.once) {
      client.once(event.type as string, (...args) => event.execute(...args));
      continue;
    }

    client.on(event.type as string, (...args) => event.execute(...args));
  }
}

// Finally, login to discord
client.login(env.DISCORD_TOKEN);
