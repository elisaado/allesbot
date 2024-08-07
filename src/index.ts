import env from "./env.js";

import { Client, GatewayIntentBits } from "discord.js";
import {
  getHandlers,
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

  registerCommand("help", {
    name: "help",
    description: "Lists all available commands",
    handle: (message, _) => {
      const handlers = getHandlers();
      const commands = Object.keys(handlers)
        .map((command) => {
          const { name, description } = handlers[command]!;

          return `**${name}**: ${description}`;
        })
        .join("\n");
      message.reply(`${commands}\n\nUse .<command> to run a command`);
    },
  });
});

client.on("messageCreate", (message) => {
  const content = message.content.split(" ");
  if (content.length === 0 || !content[0]) return;
  if (content[0][0] !== ".") return;

  handleCommand(content[0].slice(1), message, content.slice(1));
});

client.login(env.DISCORD_TOKEN);
