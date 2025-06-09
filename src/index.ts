import env from "./env.js";

import {
  ApplicationCommandType,
  Client,
  ContextMenuCommandBuilder,
  GatewayIntentBits,
  REST,
  Routes,
} from "discord.js";
import {
  getHandlers,
  getRegexHandlers,
  handleCommand,
  registerCommand,
} from "./commandHandler.js";

import db from "./db.js";

import * as _ from "./commands/activatedCommands.js";
import { handlePin, handleUnpin } from "./commands/pin.js";

const client = new Client({
  intents: [
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.DirectMessages,
  ],
});

client.on("ready", async (client) => {
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
        .filter((handler) => handler.showInHelp !== false)
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

  const data = [
    new ContextMenuCommandBuilder()
      .setName("Pin")
      .setType(ApplicationCommandType.Message),
    new ContextMenuCommandBuilder()
      .setName("Unpin")
      .setType(ApplicationCommandType.Message),
  ];

  const rest = new REST().setToken(env.DISCORD_TOKEN);
  await rest.put(Routes.applicationCommands(client.user.id), {
    body: data.map((cmd) => cmd.toJSON()),
  });
});

function exitGracefully() {
  db.close();
  process.exit();
}

process.on("SIGTERM", exitGracefully);
process.on("SIGINT", exitGracefully);

client.on("messageCreate", handleCommand);
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isMessageContextMenuCommand()) return;
  const { commandName, member: apiMember } = interaction;
  if (!apiMember) return;
  const member = await interaction.guild?.members.fetch(apiMember.user.id);
  if (!member) return;

  if (commandName === "Pin") {
    handlePin(interaction, member);
  } else if (commandName === "Unpin") {
    handleUnpin(interaction, member);
  }
});

client.login(env.DISCORD_TOKEN);

export default client;
