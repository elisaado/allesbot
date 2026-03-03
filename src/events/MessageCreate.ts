import { commands } from "$src/collectCommands.ts";
import { BotEvent } from "$src/types.ts";
import { Events, type Message, TextChannel } from "discord.js";

export const commandEvent = new BotEvent<Events.MessageCreate>({
  type: Events.MessageCreate,
  once: false,
  execute: (message: Message) => {
    if (!(message.channel instanceof TextChannel)) return;

    for (const command of commands) {
      if (command.match(message)) command.execute(message);
    }
  },
});
