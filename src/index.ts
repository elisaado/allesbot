import fs from "node:fs";
import path from "node:path";
import { client } from "./client.ts";
import { type BotEvent, BotEventGuard } from "./customTypes.ts";
import { env } from "./env.ts";

const eventsPath = path.join(import.meta.dirname ?? "", "events");
const eventFiles = fs
  .readdirSync(eventsPath)
  .filter((file) => file.endsWith(".ts"));

for (const file of eventFiles) {
  const filePath = path.join(eventsPath, file);
  const module: object = await import(`file:///${filePath}`);

  for (const entry of Object.entries(module)) {
    if (!BotEventGuard(entry[1])) {
      console.error(
        `[WARNING] The module at ${filePath} is doesn't really look like an event..`,
      );

      continue;
    }

    const event = entry[1] as BotEvent;

    if (event.once) {
      client.once(event.type as string, (...args) => event.execute(...args));
      continue;
    }

    client.on(event.type as string, (...args) => event.execute(...args));
  }
}

// Finally, login to discord
client.login(env.DISCORD_TOKEN);
