import { Events, type Message, TextChannel } from "discord.js";
import { commands } from "../collectCommands.ts";
import type { BotEvent } from "../types.ts";
import env from "../env.ts";

export const commandEvent: BotEvent = {
  type: Events.MessageCreate,
  execute: (message: Message): void => {
    if (!(message.channel instanceof TextChannel)) return;

    for (const command of commands) {
      if (
        (!command.command || (typeof command.command === typeof RegExp
          ? !!message.content.match(command.command)
          : message.content.startsWith(`${env.PREFIX}${command.command}`))) &&
        (!command.match || command.match(message))
      ) command.execute(message);
    }
  },
};
