import type { Message } from "discord.js";
import { client } from "../client.ts";
import type { Command } from "../types.ts";

export const sed: Command = {
  name: "sed",
  command: /^`?\.s`?\/`?((?:\\.|[^\/])*)\/((?:\\.|[^\/])*?)(\/(.*?))?`?$/,
  description: "Use sed to replace text in the replied to message",
  showInHelp: true,
  match: (message: Message) => Boolean(message.content.match(sed.command)),
  execute: (message: Message): void => {
    if (
      !(message.reference && message.reference.messageId)
    ) {
      message.reply("je moet een message replyen om dit te kunnen doen gekkie");
      return;
    }

    const match = message.content.match(sed.command);

    if (!match) return;
    // Will never be the case but typescript will act quirky if I dont include it

    const [, find, replace, , options] = match;
    if (!(find && replace)) return;

    if (options) {
      if (options.match(/[^gmi]/)) {
        message.reply("Duplicate regex options");
      }

      const splitted = options.split("");
      if (new Set(splitted).size !== splitted.length) {
        message.reply("Invalid regex options");
      }
    }

    const replyMessage = message.channel.messages
      .cache.get(
        message.reference.messageId,
      );

    if (!replyMessage) {
      message.reply(
        "er ging iets mis tijdens het zoeken van de message waarop je reageerde, sorry",
      );
      return;
    }

    if (replyMessage.author.id === client.user?.id) return;

    const oldContent = replyMessage.content
      || replyMessage.embeds?.[0]?.description
      || "";
    const newContent = oldContent.replace(
      new RegExp(find, options ?? "g"),
      replace.replace(/\\(.)/g, "$1"),
    );
    if (newContent.length > 1000) {
      message.reply("Resulting message is te lang aapje");
      return;
    }

    replyMessage.reply({
      allowedMentions: { repliedUser: false },
      content: `Did you mean:\n${newContent}`,
    });
  },
};
