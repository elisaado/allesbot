import type { NonSlashCommand } from "../customTypes.ts";
import type { Message } from "discord.js";

export const ping: NonSlashCommand = {
  name: "ping",
  command: "ping",
  description: "Replies with pong and the latency",
  showInHelp: true,
  match: (message: Message) => message.content === ".ping",
  execute: (message: Message): void => {
    const diff: number = Date.now() - message.createdTimestamp;
    console.log(
      `\x1b[36m > \x1b[0m Pinged ${message.author.username}.`,
    );
    message.reply(`Pong! Latency: ${diff}ms`);
  },
};
