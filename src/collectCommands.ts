import type { Message } from "discord.js";
import env from "./env.ts";
import { type Command, commandGuard } from "./types.ts";

const commands: Command[] = [
  {
    name: "help",
    command: "help",
    description: "Lists all available commands",
    showInHelp: true,
    match: (message: Message) => message.content === `${env.PREFIX}help`,
    execute: async (message: Message) => {
      let returnMessage = "";
      for (const command of commands) {
        if (command.showInHelp) {
          const commandCommand =
            (typeof command.command === "string" ? env.PREFIX : "") +
            command.command;
          returnMessage += `**${command.name}** (\`\`${commandCommand}\`\`): ${command.description}\n`;
        }
      }

      returnMessage += `\nUse ${env.PREFIX}<command> to run a command`;

      await message.reply(returnMessage);
    },
  },
];

const commandFiles = Deno.readDirSync("src/commands").filter((file) =>
  file.name.match(/\.(m|c)?(j|t)s$/),
);

for (const commandFile of commandFiles) {
  const module = (await import(`./commands/${commandFile.name}`)) as object;

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

console.log("\x1b[34m\ncommands: \x1b[0m\n", commands);

export { commands };
