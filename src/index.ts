import { client } from "./client.ts";
import { env } from "./env.ts";
import { type BotEvent, botEventGuard } from "./types.ts";

const eventFiles = Deno
  .readDirSync("src/events")
  .filter((file) => file.name.endsWith(".ts"));

for (const eventFile of eventFiles) {
  const module = await import(`./events/${eventFile.name}`) as object;

  for (let [name, event] of Object.entries(module)) {
    if (!botEventGuard(event)) {
      console.warn(
        `[WARNING] The export ${name} in module ${eventFile.name} doesn't really look like a command..`,
      );

      continue;
    }

    event = event as BotEvent;

    if (event.once) {
      client.once(event.type as string, (...args) => event.execute(...args));
      continue;
    }

    client.on(event.type as string, (...args) => event.execute(...args));
  }
}

// Finally, login to discord
client.login(env.DISCORD_TOKEN);
