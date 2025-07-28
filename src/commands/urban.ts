import { registerCommand } from "../commandHandler.js";

registerCommand({
  name: "Urban Dictionary",
  command: /^\.(ud|urban) (\d )?(\w+)$/,
  description: "Get the definition of a word from Urban Dictionary",
  handle(message, args) {
    const match = message.content.match(/^^\.(ud|urban) (\d )?(\w+)$/);

    if (!match) {
      return;
    }

    const i = +(match[2] ?? 0);
    if (i < 0 || i > 9 || isNaN(i)) {
      message.reply("Invalid index");
      return;
    }
    const word = match[3];

    fetch(`https://api.urbandictionary.com/v0/define?term=${word}`)
      .then((response) => response.json())
      .then((data) => {
        if (!(data instanceof Object)) {
          message.reply("An error occurred");
          return;
        }
        if ("list" in data === false) {
          message.reply("An error occurred");
          return;
        }
        if (data.list == undefined) {
          message.reply("An error occurred");
          return;
        }
        if (!(data.list instanceof Array)) {
          message.reply("An error occurred");
          return;
        }

        if (data.list.length === 0) {
          message.reply("No definition found");
          return;
        }

        if (i >= data.list.length) {
          message.reply("Index out of range");
          return;
        }

        const word = data.list.sort(
          (a: any, b: any) => b.thumbs_up - a.thumbs_up,
        )[i];

        message.reply({
          embeds: [
            {
              title: word.word,
              description: word.definition,
              url: word.permalink,
              footer: {
                text: `By ${word.author}\n👍 ${word.thumbs_up} | 👎 ${word.thumbs_down}`,
              },
              thumbnail: {
                url: "https://cdn.elisaado.com/ud_logo.jpeg",
              },
              color: 0xf2fd60,
            },
          ],
        });
      });
  },
});
