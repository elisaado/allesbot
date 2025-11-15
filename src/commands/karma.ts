import type { Message } from "discord.js";
import type { Command } from "../customTypes.ts";
import { db } from "../db.ts";

const specialKarmaValues: [string | RegExp, number][] = [
  [/alles( )?bot/, 9999999],
  ["<@1269730382765621288>", 9999999],
  ["typst", 9999998],
  ["SEKS :bangbang:", 9999997],
];

function getKarmaFunc(subject: string): number {
  subject = subject.toLowerCase();
  for (const specialKarmaValue of specialKarmaValues) {
    if (
      (
        typeof specialKarmaValue[0] === "function" // typeof RegExp => "function"
        && subject.match(specialKarmaValue[0])
      )
      || (
        typeof specialKarmaValue[0] === "string"
        && subject === specialKarmaValue[0]
      )
    ) return specialKarmaValue[1];
  }

  const thing: { karma: number } = db.prepare(
    "SELECT karma FROM karma WHERE subject= ?",
  ).get(subject) ?? { karma: 0 };
  return thing.karma;
}

function setKarmaFunc(subject: string, newKarma: number): void {
  db.prepare("INSERT OR REPLACE INTO karma (subject, karma) VALUES (?, ?)").get(
    subject,
    String(newKarma),
  );
}

export const getKarma: Command = {
  name: "getKarma",
  command: ".karma",
  description: "Get karma of something",
  showInHelp: true,
  match: (message: Message) => message.content.split(" ")[0] === ".karma",
  execute: (message: Message): void => {
    const subject = message.content.split(" ").slice(1).join();

    message.reply(`${subject} has **${getKarmaFunc(subject)} karma**`);
  },
};

export const setKarma: Command = {
  name: "setKarma",
  command: /^(.+)((\+\+)|(\-\-))$/,
  description: "Increase or decrease the karma of something",
  showInHelp: true,
  match: (message: Message) =>
    message.content.endsWith("--") || message.content.endsWith("++"),
  execute: (message: Message): void => {
    const subject = message.content.substring(0, message.content.length - 2)
      .trim();

    const curKarma = getKarmaFunc(subject);

    setKarmaFunc(subject, curKarma + (message.content.endsWith("++") ? 1 : -1));

    message.reply(`${subject} now has **${getKarmaFunc(subject)} karma**`);
  },
};
