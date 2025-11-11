import type { Message } from "discord.js";
import type { NonSlashCommand } from "../customTypes.ts";

export const ping: NonSlashCommand = {
  name: "ping",
  command: "ping",
  description: "Replies with pong and the latency",
  showInHelp: true,
  match: (message: Message) => message.content === ".ping",
  execute: (message: Message): void => {
    const diff: number = Date.now() - message.createdTimestamp;
    message.reply(`Pong! Latency: ${diff}ms`);
  },
};
