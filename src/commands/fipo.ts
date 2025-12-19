import { type Message, TextChannel } from "discord.js";
import { db } from "../db.ts";
import env from "../env.ts";
import type { Command } from "../types.ts";

let todaysFipos: Message<boolean>[] = [];
let recordedDate = "0-0-000";

function getAsStringDateWithCorrectTimezoneForReal(date: Date): string {
  return date.toLocaleString("nl-NL", {
    timeZone: "Europe/Amsterdam",
    day: "numeric",
    month: "numeric",
    year: "numeric",
  });
}

function getDayOfDateWithCorrectTimezoneForReal(date: Date): string {
  return date.toLocaleDateString("nl-NL", {
    day: "numeric",
    timeZone: "Europe/Amsterdam",
  });
}

export const fipo: Command = {
  name: "fipo",
  command: "fipo",
  description: "do the fipo!",
  showInHelp: true,
  match: (message: Message) => !message.author.bot,
  execute: (message: Message) => {
    // check if we need to reset the fipo
    const currentDate = getAsStringDateWithCorrectTimezoneForReal(new Date());
    if (recordedDate !== currentDate) {
      recordedDate = currentDate;
      todaysFipos = [];
    }

    todaysFipos.push(message);
    // setTimeout already running or fipo already done, no need to start it
    if (todaysFipos.length > 1) return;

    // wait 1 second to allow more fipos to come in, then grab the earliest one
    setTimeout(async () => {
      const fipo = todaysFipos
        .filter((a) => {
          return (
            getDayOfDateWithCorrectTimezoneForReal(
              new Date(a.createdTimestamp),
            ) === getDayOfDateWithCorrectTimezoneForReal(new Date())
          );
        })
        .sort((a, b) => {
          return a.createdTimestamp - b.createdTimestamp;
        })[0];

      if (!fipo) {
        console.error("no fipo found in timeout");
        todaysFipos = [];
        return;
      }

      // check if fipo is already done
      // if the bot restarts, the "todaysFipos" array will be reset,
      // but the database will still have the fipo

      // the array is still needed though, to not start a lot of timeouts

      const alreadyDone = db.sql`SELECT * FROM fipos WHERE date = ${getAsStringDateWithCorrectTimezoneForReal(
        new Date(fipo.createdTimestamp),
      )}`;

      if (alreadyDone) {
        console.log({ fipoAlreadyDone: alreadyDone });
        return;
      }

      if (
        !(message.channel instanceof TextChannel) ||
        message.channel.id !== env.FIPO_CHANNEL_ID
      ) {
        await message.reply(
          `je kan alleen fipo doen in <#${env.FIPO_CHANNEL_ID}> makker`,
        );
        return;
      }

      await message.channel.send("W00t " + fipo.author.toString() + "!");

      db.sql`INSERT INTO fipos (discord_id, date) VALUES (${fipo.author.id}, ${getAsStringDateWithCorrectTimezoneForReal(
        new Date(fipo.createdTimestamp),
      )})`;
    }, 1000);
  },
};

export const fipoStats: Command = {
  name: "fipostats",
  command: "fipostats",
  description: "Check the fipo stats",
  showInHelp: true,
  match: (message: Message) => message.content === fipoStats.command,
  execute: async (message: Message) => {
    if (!message.guild) return;

    const fipo = db.sql`
          SELECT DISTINCT(discord_id), COUNT(*) as fipos
          FROM fipos
          GROUP BY discord_id
          ORDER BY fipos DESC
          LIMIT 50
        ` as { discord_id: string; fipos: number }[];

    const members = await message.guild.members.fetch({
      user: fipo.map((e) => e.discord_id),
    });

    const fipoStats: [string, number][] = [];
    for (const { discord_id, fipos } of fipo) {
      const displayName = members.get(discord_id)?.displayName;
      if (!displayName) continue;
      fipoStats.push([displayName, fipos]);
    }

    const longestUsername = fipoStats.reduce(
      (acc, [displayName]) => Math.max(acc, displayName.length),
      0,
    );

    let returnMessage = "# fipostats\n```\n";
    for (const [displayName, fipos] of fipoStats) {
      returnMessage += `${displayName}${" ".repeat(
        longestUsername + 4 - displayName.length,
      )}: ${fipos}\n`;
    }
    message.reply(returnMessage + "```");
  },
};

export const fipoReset: Command = {
  name: "Fipo Reset",
  command: "fiporeset",
  description: "Reset the fipo stats",
  showInHelp: false,
  match: (message: Message) => message.content === fipoReset.command,
  execute: async (message: Message) => {
    if (message.author.id !== env.HOUSEMASTER_ID) {
      await message.reply("You are not allowed to do that!");
      return;
    }

    try {
      db.sql`DELETE FROM fipos`;

      todaysFipos = [];
      recordedDate = "0";

      await message.reply("Fipo stats reset!");
    } catch (err) {
      console.error(err);
      return;
    }
  },
};
