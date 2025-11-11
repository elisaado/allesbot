import { env } from "$src/config.ts";
import { type BotEvent, BotEventGuard } from "$src/customTypes.ts";
import { Client, GatewayIntentBits } from "discord.js";
import fs from "node:fs";
import path from "node:path";

// Grab all the command folders from the commands directory you created earlier
const client: Client<boolean> = new Client({
  intents: [
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.DirectMessages,
  ],
});

const eventsPath: string = path.join(import.meta.dirname ?? "", "events");
const eventFiles: string[] = fs
  .readdirSync(eventsPath)
  .filter((file: string) => file.endsWith(".ts"));

for (const file of eventFiles) {
  const filePath: string = path.join(eventsPath, file);
  const module: object = await import(`file:///${filePath}`);

  for (const entry of Object.entries(module)) {
    if (BotEventGuard(entry[1])) {
      const event: BotEvent = entry[1] as BotEvent;

      if (event.once) {
        client.once(event.type as string, (...args) => event.execute(...args));
        continue;
      }

      client.on(event.type as string, (...args) => event.execute(...args));
      continue;
    }

    console.error(
      `[WARNING] The module at ${filePath} is doesn't really look like an event..`,
    );
  }
}

// Dit runt
client.login(env.DISCORD_TOKEN);

export { client };
