import { registerCommand } from "../commandHandler.js";

registerCommand({
  name: "funny",
  command:
    /^((alles is stuk)|(stomme bot)|(alles( )?bot is stom)|(ik haat alles( )?bot)|(waarom kan alles( )?bot (.*) niet))$/i,
  description: "grappig (geen commando)",
  showInHelp: false,
  handle: async (message, args) => {
    message.reply("maak een pr dan :) https://github.com/elisaado/allesbot");
  },
});
