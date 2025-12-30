import { registerCommand } from "../commandHandler.js";
import client from "../index.js";

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

registerCommand({
  name: "anti-scheld",
  command: /kanker/i,
  description: "grappig (geen commando)",
  showInHelp: false,
  handle: async (message, args) => {
    // nie schelde met kanker
    await message.member?.timeout(1 * 60 * 1000);

    message.reply("nie schelden met kanker :(");
  },
});

registerCommand({
  name: "yucky",
  command: /(my favorite game)|(erase and rewind)/i,
  description: "grappig (geen commando)",
  showInHelp: false,
  handle: async (message, args) => {
    if (message.author.id === client.user?.id) return;

    let match = message.content.match(
      /^(my favorite game)|(erase and rewind)$/i,
    )?.[0];
    let artist = "The Cardigans";
    const replies = [
      `${match}??? is dit een ${artist} reference???`,
      `yoooo, ${match}!!! dat is ook een liedje van ${artist}`,
      `wow ${match} die is echt hard (van ${artist})`,
    ];
    message.reply(replies[Math.floor(Math.random() * replies.length)]!);
  },
});

registerCommand({
  name: "yucky",
  command: /(the pretender)/i,
  description: "grappig (geen commando)",
  showInHelp: false,
  handle: async (message, args) => {
    if (message.author.id === client.user?.id) return;

    let match = message.content.match(/^(the pretender)$/i)?.[0];
    let artist = "Foo fighters";
    const replies = [
      `${match}??? is dit een ${artist} reference???`,
      `yoooo, ${match}!!! dat is ook een liedje van ${artist}`,
      `wow ${match} die is echt hard (van ${artist})`,
    ];
    message.reply(replies[Math.floor(Math.random() * replies.length)]!);
  },
});

registerCommand({
  name: "yucky",
  command:
    /(lonely boy)|(tighten up)|(gold on the ceiling)|(little black submarines)|(fever)|(weight of love)/i,
  description: "grappig (geen commando)",
  showInHelp: false,
  handle: async (message, args) => {
    if (message.author.id === client.user?.id) return;

    let match = message.content.match(
      /^(lonely boy)|(tighten up)|(gold on the ceiling)|(little black submarines)|(fever)|(weight of love)$/i,
    )?.[0];
    let artist = "The Black Keys";
    const replies = [
      `${match}??? is dit een ${artist} reference???`,
      `yoooo, ${match}!!! dat is ook een liedje van ${artist}`,
      `wow ${match} die is echt hard (van ${artist})`,
    ];
    message.reply(replies[Math.floor(Math.random() * replies.length)]!);
  },
});
