import type { Message } from "discord.js";
import type { Command } from "../types.ts";

export const funny: Command = {
  name: "funny",
  command:
    /^(pr dan)|((alles is stuk)|(stomme bot)|(alles( )?bot is stom)|(ik haat alles( )?bot)|(waarom kan alles( )?bot (.*) niet))$/i,
  description: "grappig (geen commando)",
  showInHelp: false,
  execute: async (message: Message) => {
    if (
      message.content === "pr dan" &&
      message.reference &&
      message.reference.messageId
    ) {
      const referencedMessage = await message.channel.messages.fetch(
        message.reference.messageId,
      );
      message = referencedMessage;
    }

    await message.reply(
      "maak een pr dan :) <https://github.com/elisaado/allesbot>",
    );
  },
};
