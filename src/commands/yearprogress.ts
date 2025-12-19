import type { Message } from "discord.js";
import type { Command } from "../types.ts";

export const yearprogress: Command = {
  name: "year progress",
  command: "yp",
  description: "hoe ver is het jaar",
  showInHelp: true,
  match: (message: Message) => message.content === yearprogress.command,
  execute: (message: Message) => {
    const date = new Date();
    const start = Date.UTC(date.getFullYear(), 0, 0);
    const end = Date.UTC(date.getFullYear() + 1, 0, 0);
    const currentDay =
      (Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) - start) /
      24 /
      60 /
      60 /
      1000;
    const maxDay = (end - start) / 24 / 60 / 60 / 1000;

    message.reply(
      `We zijn al ysu **${((currentDay / maxDay) * 100).toFixed(1)}%** in het jaar`,
    );
  },
};
