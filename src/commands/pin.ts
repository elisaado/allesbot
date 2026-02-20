import env from "$src/env.ts";
import type { Command } from "$src/types.ts";
import type { Message } from "discord.js";

export const pin: Command = {
  name: "pin",
  command: "pin",
  description: "Pin een bericht",
  showInHelp: true,
  match: (message: Message) => message.content === env.PREFIX + pin.command,
  execute: async (message: Message) => {
    if (message.reference === null || message.reference.messageId === null) {
      await message.reply("omg gebruik dit op een bericht ofz");
      return;
    }

    if (!message.member) {
      await message.reply("je moet een lid zijn van de server om dit te doen");
      return;
    }

    if (!message.member.roles.cache.has(env.BEKEND_ROLE_ID)) {
      await message.reply(
        "ik ben niet jouw vriend, laat dat ook even duidelijk zijn",
      );
      return;
    }

    const referenced = await message.fetchReference();

    if (referenced.pinned) {
      await message.reply("dit bericht is al gepind aapje");
      return;
    }

    await referenced.pin();
    await message.reply(`bericht gepind door <@${message.author.id}>`);
  },
};

export const unpin: Command = {
  name: "unpin",
  command: "unpin",
  description: "Unpin een bericht",
  showInHelp: true,
  match: (message: Message) => message.content === unpin.command,
  execute: async (message: Message) => {
    if (message.reference === null || message.reference.messageId === null) {
      await message.reply("omg gebruik dit op een bericht ofz");
      return;
    }

    if (!message.member) {
      await message.reply("je moet een lid zijn van de server om dit te doen");
      return;
    }

    if (!message.member.roles.cache.has(env.BEKEND_ROLE_ID)) {
      await message.reply(
        "ik ben niet jouw vriend, laat dat ook even duidelijk zijn",
      );
      return;
    }

    const referenced = await message.fetchReference();

    if (!referenced.pinned) {
      await message.reply("dit bericht is niet gepind aapje");
      return;
    }

    await referenced.unpin();
    await message.reply(`bericht geunpind door <@${message.author.id}>`);
  },
};
