import { client } from "$src/client.ts";
import env from "$src/env.ts";
import type { Command } from "$src/types.ts";
import type { Message } from "discord.js";

export const sed: Command = {
  name: "sed",
  command: /^.s`?\/`?((?:\\.|[^\/])*)\/((?:\\.|[^\/])*?)(\/(.*?))?$/,
  description: "Use sed to replace text in the replied to message",
  showInHelp: true,
  match: (message: Message) =>
    Boolean(message.content.match(sed.command)) &&
    message.content[0] === env.PREFIX,
  execute: async (message: Message) => {
    if (!(message.reference && message.reference.messageId)) {
      await message.reply(
        "je moet een message replyen om dit te kunnen doen gekkie",
      );
      return;
    }

    const match = message.content.match(sed.command);

    if (!match) return;
    // Will never be the case but typescript will act quirky if I dont include it

    const [, find, replace, , options] = match;
    if (!(find && replace)) return;

    if (options) {
      if (options.match(/[^gmi]/)) {
        await message.reply("Duplicate regex options");
        return;
      }

      const splitted = options.split("");
      if (new Set(splitted).size !== splitted.length) {
        await message.reply("Invalid regex options");
        return;
      }
    }

    const replyMessage = message.channel.messages.cache.get(
      message.reference.messageId,
    );

    if (!replyMessage) {
      await message.reply(
        "er ging iets mis tijdens het zoeken van de message waarop je reageerde, sorry",
      );
      return;
    }

    if (replyMessage.author.id === client.user.id) return;

    const oldContent = replyMessage.content ||
      replyMessage.embeds[0].description || "";
    const newContent = oldContent.replace(
      new RegExp(find, options ?? "g"),
      replace.replace(/\\(.)/g, "$1"),
    );

    if (newContent.length > 1000) {
      await message.reply("Resulting message is te lang aapje");
      return;
    }

    await replyMessage.reply({
      allowedMentions: { repliedUser: false },
      content: `Did you mean:\n${newContent}`,
    });
  },
};
