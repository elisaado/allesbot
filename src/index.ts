import { client } from "./client.ts";
import env from "./env.ts";
import { BotEvent } from "./types.ts";

const eventFiles = Deno.readDirSync("src/events").filter((file) =>
  file.name.endsWith(".ts"),
);

for (const eventFile of eventFiles) {
  const module = (await import(`./events/${eventFile.name}`)) as object;

  for (const [name, entry] of Object.entries(module)) {
    if (!(entry instanceof BotEvent)) {
      console.warn(
        `[WARNING] The export ${name} in module ${eventFile.name} doesn't really look like an event..`,
      );

      continue;
    }

    if (entry.once) {
      client.once(entry.type as string, (...args) => entry.execute(...args));
    } else {
      client.on(entry.type as string, (...args) => entry.execute(...args));
    }
  }
}

client.login(env.DISCORD_TOKEN);
