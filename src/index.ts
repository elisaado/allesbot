import { client } from "./client.ts";
import env from "./env.ts";
import { type BotEvent, botEventGuard } from "./types.ts";

const eventFiles = Deno.readDirSync("src/events").filter((file) =>
  file.name.endsWith(".ts")
);

for (const eventFile of eventFiles) {
  const module = (await import(`./events/${eventFile.name}`)) as object;

  for (const [name, entry] of Object.entries(module)) {
    if (!botEventGuard(entry)) {
      console.warn(
        `[WARNING] The export ${name} in module ${eventFile.name} doesn't really look like an event..`,
      );

      continue;
    }

    const event = entry as BotEvent<typeof entry.type>;

    if (event.once) {
      client.once(event.type as string, (...args) => event.execute(...args));
    } else {
      client.on(event.type as string, (...args) => event.execute(...args));
    }
  }
}

client.login(env.DISCORD_TOKEN);
