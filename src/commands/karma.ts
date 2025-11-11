import type { NonSlashCommand } from "$src/customTypes.ts";
import type { Message } from "discord.js";
import { db } from "../db.ts";

function getKarmaFunc(subject: string): number {
  if (
    subject.match(/alles( )?bot/i) || subject.includes("<@1269730382765621288>")
  ) return 9999999;
  if (subject.includes("typst")) return 9999998;
  if (subject.includes("SEKS :bangbang:")) return 9999997;

  const thing: { karma: number } | undefined = db.prepare(
    "SELECT karma FROM karma WHERE subject= ?",
  ).get(subject);
  return thing?.karma ?? 0;
}

function setKarmaFunc(subject: string, newKarma: number): void {
  db.prepare("INSERT OR REPLACE INTO karma (subject, karma) VALUES (?, ?)").get(
    subject,
    String(newKarma),
  );
}

export const getKarma: NonSlashCommand = {
  name: "getKarma",
  command: ".karma ",
  description: "Get karma of something",
  match: (message: Message) => message.content.split(" ")[0] === ".karma",
  execute: (message: Message): void => {
    const subject = message.content.split(" ").slice(1).join();

    message.reply(`${subject} has **${getKarmaFunc(subject)} karma**`);
  },
};

export const setKarma: NonSlashCommand = {
  name: "setKarma",
  command: /^(.+)((\+\+)|(\-\-))$/,
  description: "Increase or decrease the karma of something",
  match: (message: Message) =>
    message.content.endsWith("--") || message.content.endsWith("++"),
  execute: (message: Message): void => {
    const subject = message.content.substring(0, message.content.length - 2)
      .trim();
    console.log(subject);

    const curKarma = getKarmaFunc(subject);

    setKarmaFunc(subject, curKarma + (message.content.endsWith("++") ? 1 : -1));

    message.reply(`${subject} now has **${getKarmaFunc(subject)} karma**`);
  },
};
