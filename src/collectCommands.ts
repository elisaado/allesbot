import type { Message } from "discord.js";
import fs from "node:fs";
import path from "node:path";
import { type Command, CommandGuard } from "./customTypes.ts";

const commands: Command[] = [];

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
      commands.push(entry[1] as Command);
      continue;
    }

    console.error(
      `[WARNING] The export ${entry[0]} module at ${filePath} doesn't really look like a command..`,
    );
  }
}

commands.push({
  name: "help",
  command: ".help",
  description: "Lists all available commands",
  showInHelp: true,
  match: (message: Message) => message.content === ".help",
  execute: (message: Message): void => {
    let returnMessage: string = "";
    for (const command of commands) {
      if (command.showInHelp) {
        returnMessage +=
          `**${command.name}** (\`\`${command.command.toString()}\`\`): ${command.description}\n`;
      }
    }
    message.reply(returnMessage);
  },
});

console.log(
  "\x1b[34m\ncommands: \x1b[0m\n",
  commands,
);

export { commands };
