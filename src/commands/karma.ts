import { db } from "$src/db.ts";
import env from "$src/env.ts";
import type { Command } from "$src/types.ts";
import type { Message } from "discord.js";

const specialKarmaValues: [string | RegExp, number][] = [
  [/(alles( )?bot)|(<@1269730382765621288>)/, 9999999],
  ["typst", 9999998],
  ["SEKS :bangbang:", 9999997],
];

function getKarma(subject: string): number {
  subject = subject.toLowerCase();
  for (const [specialSubject, specialKarma] of specialKarmaValues) {
    if (
      (typeof specialSubject === typeof RegExp &&
        subject.match(specialSubject)) ||
      (typeof specialSubject === "string" && subject === specialSubject)
    )
      return specialKarma;
  }

  return (
    (
      db.sql`SELECT karma FROM karma WHERE subject = ${subject}` as {
        karma?: number;
      }
    ).karma ?? 0
  );
}

function setKarma(subject: string, newKarma: number): void {
  db.sql`INSERT OR REPLACE INTO karma (subject, karma) VALUES (${subject}, ${newKarma})`;
}

export const getKarmaCommand: Command = {
  name: "getKarma",
  command: "karma",
  description: "Get karma of something",
  showInHelp: true,
  match: (message: Message) =>
    message.content === env.PREFIX + getKarmaCommand.command,
  execute: async (message: Message) => {
    const subject = message.content.split(" ").slice(1).join();
    await message.reply(`${subject} has **${getKarma(subject)} karma**`);
  },
};

export const setKarmaCommand: Command = {
  name: "setKarma",
  command: /.*(\+\+|--)$/g,
  description: "Increase or decrease the karma of something",
  showInHelp: true,
  match: (message) =>
    message.content.endsWith("--") || message.content.endsWith("++"),
  execute: async (message: Message) => {
    const subject = message.content
      .substring(0, message.content.length - 2)
      .trim();
    const oldKarma = getKarma(subject);
    setKarma(subject, oldKarma + (message.content.endsWith("++") ? 1 : -1));
    await message.reply(`${subject} now has **${getKarma(subject)} karma**`);
  },
};
