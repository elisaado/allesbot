import env from "$src/env.ts";
import type { Command } from "$src/types.ts";
import { EmbedBuilder, type Message } from "discord.js";

export type UrbanDictionaryEntry = {
  author: string;
  current_vote: string;
  defid: number;
  definition: string;
  example: string;
  permalink: string;
  thumbs_down: number;
  thumbs_up: number;
  word: string;
  written_on: string;
};

export type UrbanDictionaryResponse = {
  list: UrbanDictionaryEntry[];
};

export const urban: Command = {
  name: "Urban Dictionary",
  command: /^.(ud|urban) (\d )?(\w+)$/,
  description: "Get the definition of a word from Urban Dictionary",
  showInHelp: true,
  match: (message: Message) =>
    Boolean(message.content.match(urban.command)) &&
    message.content[0] === env.PREFIX,
  execute: async (message: Message) => {
    const word = message.content.split(" ")[1];

    if (!word) {
      await message.reply("geef dan ook een woord jij vage kennis");
      return;
    }

    const response = await fetch(
      `https://api.urbandictionary.com/v0/define?term=${word}`,
    );

    if (!response.ok) {
      await message.reply("Oopsie, something went wrong");
      return;
    }

    const responseData = (await response.json()) as UrbanDictionaryResponse;

    if (!(responseData.list && responseData.list[0])) {
      await message.reply("Definition not found :\\");
      return;
    }

    const embeddedData: UrbanDictionaryEntry = responseData.list[0];

    const udEmbed = new EmbedBuilder()
      .setTitle(embeddedData.word)
      .setDescription(embeddedData.definition)
      .setURL(embeddedData.permalink)
      .setFooter({
        text: `By ${embeddedData.author}\n👍 ${embeddedData.thumbs_up} | 👎 ${embeddedData.thumbs_down}`,
      })
      .setThumbnail("https://cdn.elisaado.com/ud_logo.jpeg")
      .setColor(0xf2fd60);

    await message.reply({
      embeds: [udEmbed],
    });
  },
};
