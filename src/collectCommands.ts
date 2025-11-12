import {
  type Command,
  CommandGuard,
} from "./customTypes.ts";
import fs from "node:fs";
import path from "node:path";

const nonSlashCommands: Command[] = [];

// Grabs all files in commands/slashCommands
const commandsPath: string = path.join(
  import.meta.dirname ?? "",
  "commands",
);
const commandFiles: string[] = fs
  .readdirSync(commandsPath)
  .filter((file: string) => file.endsWith(".ts"));

for (const file of commandFiles) {
  const filePath: string = path.join(commandsPath, file);
  const module: object = await import(`file:///${filePath}`);

  for (const entry of Object.entries(module)) {
    if (CommandGuard(entry[1])) {
      nonSlashCommands.push(entry[1] as Command);
      continue;
    }

    console.error(
      `[WARNING] The module at ${filePath} is doesn't really look like a command..`,
    );
  }
}

console.log(
  "\x1b[34m\nNonSlashCommands: \x1b[0m\n",
  nonSlashCommands,
);

export { nonSlashCommands };
