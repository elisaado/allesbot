import type { Message } from "discord.js";
import { type Command, commandGuard } from "./types.ts";

const commands: Command[] = [];

const commandFiles = Deno
  .readDirSync("src/commands")
  .filter((file) => file.name.endsWith(".ts"));

for (const commandFile of commandFiles) {
  const module = await import(`./commands/${commandFile.name}`) as object;

  for (const [name, command] of Object.entries(module)) {
    if (!commandGuard(command)) {
      console.warn(
        `[WARNING] The export ${name} in module ${commandFile.name} doesn't really look like a command..`,
      );

      continue;
    }

    commands.push(command as Command);
  }
}

commands.push({
  name: "help",
  command: ".help",
  description: "Lists all available commands",
  showInHelp: true,
  match: (message: Message) => message.content === ".help",
  execute: (message: Message): void => {
    let returnMessage = "";
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
