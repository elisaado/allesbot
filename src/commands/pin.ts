import type { Message } from "discord.js";
import { env } from "../config.ts";
import type { NonSlashCommand } from "../customTypes.ts";

export const pin: NonSlashCommand = {
  name: "pin",
  command: ".pin",
  description: "Pin een bericht",
  showInHelp: true,
  match: (message: Message) => message.content === ".pin",
  execute: async (message: Message): Promise<void> => {
    if (
      message.reference === null
      || message.reference.messageId === null
    ) {
      message.reply("omg gebruik dit op een bericht ofz");
      return;
    }

    if (!message.member) {
      message.reply(
        "je moet een lid zijn van de server om dit te doen",
      );
      return;
    }

    if (!message.member.roles.cache.has(env.BEKEND_ROLE_ID)) {
      message.reply(
        "ik ben niet jouw vriend, laat dat ook even duidelijk zijn",
      );
      return;
    }

    const referenced = await message.fetchReference();

    if (referenced.pinned) {
      message.reply(
        "dit bericht is al gepind aapje",
      );
      return;
    }

    referenced.pin();
    message.reply(`bericht gepind door <@${message.author.id}>`);
  },
};

export const unpin: NonSlashCommand = {
  name: "unpin",
  command: ".unpin",
  description: "Unpin een bericht",
  showInHelp: true,
  match: (message: Message) => message.content === ".unpin",
  execute: async (message: Message): Promise<void> => {
    if (
      message.reference === null
      || message.reference.messageId === null
    ) {
      message.reply("omg gebruik dit op een bericht ofz");
      return;
    }

    if (!message.member) {
      message.reply(
        "je moet een lid zijn van de server om dit te doen",
      );
      return;
    }

    if (!message.member.roles.cache.has(env.BEKEND_ROLE_ID)) {
      message.reply(
        "ik ben niet jouw vriend, laat dat ook even duidelijk zijn",
      );
      return;
    }

    const referenced = await message.fetchReference();

    if (!referenced.pinned) {
      message.reply(
        "dit bericht is niet gepind aapje",
      );
      return;
    }

    referenced.unpin();
    message.reply(`bericht geunpind door <@${message.author.id}>`);
  },
};
