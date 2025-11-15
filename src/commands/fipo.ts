import {
  type Collection,
  type GuildMember,
  type Message,
  TextChannel,
} from "discord.js";
import type { Command } from "../customTypes.ts";
import { db } from "../db.ts";
import { env } from "../env.ts";
import { biggestStringSize, sortRecord } from "../utils.ts";

let todaysFipos: Message<boolean>[] = [];
let recordedDate: string = "0-0-000";

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
  command: ".fipo",
  description: "do the fipo!",
  showInHelp: true,
  match: (message: Message) => message.content === ".fipo",
  execute: (message: Message): void => {
    if (message.author.bot) return;
    // check if we need to reset the fipo
    if (
      recordedDate !== getAsStringDateWithCorrectTimezoneForReal(new Date())
    ) {
      recordedDate = getAsStringDateWithCorrectTimezoneForReal(new Date());

      todaysFipos = [];
    }

    todaysFipos.push(message);

    if (todaysFipos.length > 1) {
      // setTimeout already running or fipo already done, no need to start it
      console.log({ fipoAlreadyRunning: true });
      console.log({ todaysFipos });
      return;
    }

    // wait 1 second to allow more fipos to come in, then grab the earliest one
    setTimeout(() => {
      const fipo: Message<boolean> = todaysFipos
        .filter((a: Message<boolean>) => {
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

      const alreadyDone = db
        .sql`SELECT * FROM fipos WHERE date = ${
        getAsStringDateWithCorrectTimezoneForReal(
          new Date(fipo.createdTimestamp),
        )
      }`;

      if (alreadyDone) {
        console.log({ fipoAlreadyDone: alreadyDone });
        return;
      }

      if (
        !(message.channel instanceof TextChannel)
        || message.channel.id !== env.BEKEND_ROLE_ID
      ) {
        message.reply(
          "je kan alleen fipo doen in <#789249810032361508> makker",
        );
        return;
      }

      message.channel.send("W00t " + fipo.author.toString() + "!");

      db.sql`INSERT INTO fipos (discord_id, date) VALUES (${fipo.author.id}, ${
        getAsStringDateWithCorrectTimezoneForReal(
          new Date(fipo.createdTimestamp),
        )
      })`;
    }, 1000);
  },
};

export const fipoStats: Command = {
  name: "fipostats",
  command: ".fipostats",
  description: "Check the fipo stats",
  showInHelp: true,
  match: (message: Message) => message.content === ".fipostats",
  execute: async (message: Message): Promise<void> => {
    if (!message.guild) return;

    const rawFipoEntries: Record<string, number | string>[] = db.sql`
      SELECT * FROM fipos`;

    const fipoEntries: { discord_id: string; date: string }[] = [];

    for (const rawFipoEntry of rawFipoEntries) {
      fipoEntries.push({
        discord_id: String(rawFipoEntry.discord_id),
        date: String(rawFipoEntry.date),
      });
    }

    const userLookUp: Record<string, string> = {};
    const guildMembers: Collection<string, GuildMember> = await message.guild
      .members
      .fetch();
    for (const guildMember of guildMembers) {
      userLookUp[guildMember[1].id] = guildMember[1].displayName;
    }

    // string is username, number is amount of fipuntjes
    let fipoStats: Record<string, number> = {};

    for (const fipoEntry of fipoEntries) {
      const currentMember = userLookUp[fipoEntry.discord_id];
      if (typeof fipoStats[currentMember] !== "number") {
        fipoStats[currentMember] = 0;
      }

      fipoStats[currentMember]++;
    }

    fipoStats = sortRecord(fipoStats);

    const longestUsername = biggestStringSize(fipoStats);

    let returnMessage = "# fipostats\n```\n";
    for (const fipoStat of Object.entries(fipoStats)) {
      returnMessage += fipoStat[0]
        + " ".repeat(longestUsername + 4 - fipoStat[0].length) + ": "
        + fipoStat[1] + "\n";
    }
    message.reply(returnMessage + "```");
  },
};

export const fipoReset: Command = {
  name: "Fipo Reset",
  command: ".fiporeset",
  description: "Reset the fipo stats",
  showInHelp: false,
  match: (message: Message) => message.content === ".fiporeset",
  execute: (message: Message) => {
    if (message.author.id !== "783447871596920892") {
      message.reply("You are not allowed to do that!");
      return;
    }

    try {
      db.sql`DELETE FROM fipos`;

      todaysFipos = [];
      recordedDate = "0";

      message.reply("Fipo stats reset!");
    } catch (err) {
      console.error(err);
      return;
    }
  },
};
