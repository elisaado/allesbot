import { registerCommand } from "../commandHandler.js";

registerCommand({
  name: "funny",
  command:
    /^(pr dan)|((alles is stuk)|(stomme bot)|(alles( )?bot is stom)|(ik haat alles( )?bot)|(waarom kan alles( )?bot (.*) niet))$/i,
  description: "grappig (geen commando)",
  showInHelp: false,
  handle: async (message, args) => {
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
    message.reply("maak een pr dan :) <https://github.com/elisaado/allesbot>");
  },
});
