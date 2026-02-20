import { commands } from "$src/collectCommands.ts";
import type { BotEvent } from "$src/types.ts";
import { Events, type Message, TextChannel } from "discord.js";

export const commandEvent: BotEvent<Events.MessageCreate> = {
  type: Events.MessageCreate,
  execute: (message: Message) => {
    if (!(message.channel instanceof TextChannel)) return;

    for (const command of commands) {
      if (command.match(message)) command.execute(message);
    }
  },
};
