import type { Command } from "$src/types.ts";
import type { Message } from "discord.js";
import { client } from "../client.ts";

function unwrap<T>($: T | undefined | null): NonNullable<T> {
  if ($ === undefined || $ === null) {
    throw new Error("Unwrapping failed: value is undefined or null");
  }

  return $;
}

function randomReply(match: string, artist: string): string {
  const replies = [
    `${match}??? is dit een ${artist} reference???`,
    `yoooo, ${match}!!! dat is ook een liedje van ${artist}`,
    `wow ${match} die is echt hard (van ${artist})`,
  ];

  return replies[Math.floor(Math.random() * replies.length)];
}

export const funny: Command = {
  name: "funny",
  command:
    /^(pr dan)|((alles is stuk)|(stomme bot)|(alles( )?bot is stom)|(ik haat alles( )?bot)|(waarom kan alles( )?bot (.*) niet))$/i,
  description: "grappig (geen commando)",
  showInHelp: false,
  match: (message: Message) => Boolean(message.content.match(funny.command)),
  execute: async (message: Message) => {
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

    await message.reply(
      "maak een pr dan :) <https://github.com/elisaado/allesbot>",
    );
  },
};

export const antiScheld: Command = {
  name: "anti-scheld",
  command: /kanker/i,
  description: "niet schelden met kanker :(",
  showInHelp: false,
  match: (message: Message) =>
    Boolean(message.content.match(antiScheld.command)) &&
    message.author.id !== client.user.id,
  execute: async (message: Message) => {
    // nie schelde met kanker
    await message.member?.timeout(10000);

    await message.reply("nie schelden met kanker :(");
  },
};

export const liedje1: Command = {
  name: "liedje",
  command: /(my favorite game)|(erase and rewind)/i,
  description: "grappig (geen commando)",
  showInHelp: false,
  match: (message: Message) =>
    Boolean(message.content.match(liedje1.command)) &&
    message.author.id !== client.user.id,
  execute: async (message: Message) => {
    const match = unwrap(message.content.match(liedje1.command))[0];
    await message.reply(randomReply(match, "The Cardigans"));
  },
};

export const liedje2: Command = {
  name: "liedje",
  command: /(the pretender)/i,
  description: "grappig (geen commando)",
  showInHelp: false,
  match: (message: Message) =>
    Boolean(message.content.match(liedje2.command)) &&
    message.author.id !== client.user.id,
  execute: async (message: Message) => {
    const match = unwrap(message.content.match(liedje2.command))[0];
    await message.reply(randomReply(match, "Foo fighters"));
  },
};

export const liedje3: Command = {
  name: "liedje",
  command:
    /(lonely boy)|(tighten up)|(gold on the ceiling)|(little black submarines)|(fever)|(weight of love)/i,
  description: "grappig (geen commando)",
  showInHelp: false,
  match: (message: Message) =>
    Boolean(message.content.match(liedje3.command)) &&
    message.author.id !== client.user.id,
  execute: async (message: Message) => {
    const match = unwrap(message.content.match(liedje3.command))[0];
    await message.reply(randomReply(match, "The Black Keys"));
  },
};
