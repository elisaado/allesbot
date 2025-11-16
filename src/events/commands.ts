import { Events, type Message, TextChannel } from "discord.js";
import { commands } from "../collectCommands.ts";
import type { BotEvent } from "../types.ts";

export const commandEvent: BotEvent = {
  type: Events.MessageCreate,
  execute: (message: Message): void => {
    if (!(message.channel instanceof TextChannel)) return;

    for (const command of commands) {
      if (command.match(message)) command.execute(message);
    }
  },
};
