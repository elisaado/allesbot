import { nonSlashCommands } from "../collectCommands.ts";
import type { BotEvent } from "../customTypes.ts";
import { Events, type Message, TextChannel } from "discord.js";

export const nonSlashCommandEvent: BotEvent = {
  type: Events.MessageCreate,
  execute: (message: Message): void => {
    if (!(message.channel instanceof TextChannel)) return;

    for (const nonSlashCommand of nonSlashCommands) {
      if (nonSlashCommand.match(message)) {
        nonSlashCommand.execute(message);
      }
    }
  },
};
