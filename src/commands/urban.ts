import { EmbedBuilder, type Message } from "discord.js";
import type {
  Command,
  UrbanDictionaryEntry,
  UrbanDictionaryResponse,
} from "../customTypes.ts";

export const ping: Command = {
  name: "Urban Dictionary",
  command: /^\.(ud|urban) (\d )?(\w+)$/,
  description: "Get the definition of a word from Urban Dictionary",
  match: (message: Message) =>
    message.content.split(" ")[0] === ".ud"
    || message.content.split(" ")[0] === ".urban",
  execute: async (message: Message): Promise<void> => {
    const word: string = message.content.split(" ")[1];

    if (!word) {
      message.reply("geef dan ook een woord jij vage kennis");
      return;
    }

    const response: Response = await fetch(
      `https://api.urbandictionary.com/v0/define?term=${word}`,
    );

    if (!response.ok) {
      message.reply("Oopsie, something went wrong");
      return;
    }

    const responseData: UrbanDictionaryResponse = await response.json();

    if (!(responseData.list && responseData.list[0])) {
      message.reply("Definition not found :\\");
      return;
    }

    const dataIWant: UrbanDictionaryEntry = responseData.list[0];

    const udEmbed: EmbedBuilder = new EmbedBuilder()
      .setTitle(dataIWant.word)
      .setDescription(dataIWant.definition)
      .setURL(dataIWant.permalink)
      .setFooter({
        text:
          `By ${dataIWant.author}\n👍 ${dataIWant.thumbs_up} | 👎 ${dataIWant.thumbs_down}`,
      })
      .setThumbnail("https://cdn.elisaado.com/ud_logo.jpeg")
      .setColor(0xf2fd60);

    message.reply({
      embeds: [udEmbed],
    });
  },
};
