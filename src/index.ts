import env from "./env.js";

import { Client, GatewayIntentBits, TextChannel } from "discord.js";
import {
  getHandlers,
  getRegexHandlers,
  handleCommand,
  registerCommand,
} from "./commandHandler.js";

import db from "./db.js";

import * as _ from "./commands/activatedCommands.js";

const client = new Client({
  intents: [
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildPresences,
  ],
});

client.on("ready", (client) => {
  console.log(`Logged in as ${client.user.tag}`);

  registerCommand({
    name: "help",
    command: "help",
    description: "Lists all available commands",
    handle: (message, _) => {
      const handlers = getHandlers();
      const regexHandlers = getRegexHandlers();
      const commands = [Object.values(handlers), regexHandlers]
        .flat()
        .map((handler) => {
          const { name, description, command } = handler;
          let commandString =
            typeof command === "string" ? "." + command : command.toString();

          return `**${name}** (\`${commandString}\`): ${description}`;
        })
        .join("\n");
      message.reply({
        allowedMentions: { repliedUser: false },
        content: `${commands}\n\nUse .<command> to run a command`,
      });
    },
  });
});

client.on("messageCreate", handleCommand);

client.login(env.DISCORD_TOKEN);

export default client;
