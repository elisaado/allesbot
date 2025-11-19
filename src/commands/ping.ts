import { type Message, TextChannel } from "discord.js";
import type { Command } from "../types.ts";

export const ping: Command = {
  name: "ping",
  command: "ping",
  description: "Replies with pong and the latency",
  showInHelp: true,
  match: (message: Message) => message.content === ping.command,
  execute: async (message: Message) => {
    const diff = Date.now() - message.createdTimestamp;

    await message.reply(`Pong! Latency: ${diff}ms`);
  },
};

export const editPing: Command = {
  name: "editPing",
  command: /.editping/i,
  description: "Measures the latency by editing the message",
  showInHelp: true,
  match: (message: Message) => Boolean(message.content.match(editPing.command)),
  execute: async (message: Message) => {
    if (!(message.channel instanceof TextChannel)) return;

    await message.channel.send("Pinging...").then((sent) => {
      const diff = Date.now() - sent.createdTimestamp;

      sent.edit(`Pong! Latency: ${diff}ms`);
    });
  },
};
