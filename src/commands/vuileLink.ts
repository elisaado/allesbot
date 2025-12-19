import type { Message } from "discord.js";
import { client } from "../client.ts";
import type { Command } from "../types.ts";
// thank you for the list, https://stackoverflow.com/questions/76372936/what-is-the-most-efficient-way-to-remove-tracking-marketing-etc-query-parameter
import badKeys from "$static/badKeys.json" with { type: "json" };

export const vuileLink: Command = {
  name: "vuileLink",
  command:
    /(https?:\/\/)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&\/\/="'!]*)/,
  description: "maakt links schoon (geen commando)",
  showInHelp: false,
  match: (message: Message) =>
    Boolean(message.content.match(vuileLink.command)) &&
    message.author.id !== client.user?.id,
  execute: async (message: Message) => {
    const urlInMessage = message.content.match(
      /(https?:\/\/)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&\/\/=]*)/i,
    )?.[0];

    if (!urlInMessage) return;

    const parsedUrl = URL.parse(urlInMessage);
    if (!parsedUrl) return;

    // we can't delete because the for loop internally keeps an index which will shift we we delete
    const toDelete = [];
    for (const key of parsedUrl.searchParams.keys()) {
      if (badKeys.includes(key)) toDelete.push(key);
    }

    if (toDelete.length === 0) return;

    for (const badKey of toDelete) parsedUrl.searchParams.delete(badKey);

    const cleanURL = parsedUrl.toString();
    await message.reply(
      `jij bent VIES en je stomme linkje ook! Hier is een schone versie: ${cleanURL}`,
    );
  },
};
