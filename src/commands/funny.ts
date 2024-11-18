import { registerCommand } from "../commandHandler.js";

registerCommand({
  name: "funny",
  command:
    /^((alles is stuk)|(stomme bot)|(ik haat allesbot)|(waarom kan allesbot (.*) niet))$/i,
  description: "grappig (geen commando)",
  showInHelp: false,
  handle: async (message, args) => {
    message.reply("maak een pr dan :) https://github.com/elisaado/allesbot");
  },
});
