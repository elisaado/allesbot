import type { Message } from "discord.js";
import { registerCommand } from "../commandHandler.js";
import db from "../db.js";

let todaysFipos: Message<boolean>[] = [];
let recordedDate = "0-0-000";

registerCommand({
  name: "fipo",
  command: "fipo",
  description: "do the fipo!",
  handle: (message, _) => {
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
      return;
    }

    // wait 1 seconds to allow more fipos to come in, then grab the earliest one
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
        return;
      }

      // check if fipo is already done
      // if the bot restarts, the "todaysFipos" array will be reset,
      // but the database will still have the fipo

      // the array is still needed though, to not start a lot of timeouts

      let alreadyDone = await (() => {
        return new Promise((resolve) => {
          db.get(
            "SELECT * FROM fipos WHERE date = ?",
            [
              getAsStringDateWithCorrectTimezoneForReal(
                new Date(fipo.createdTimestamp),
              ),
            ],
            (err, row) => {
              if (err) {
                console.error(err);
                return;
              }

              resolve(row != null);
            },
          );
        });
      })();

      if (alreadyDone) {
        console.log({ fipoAlreadyDone: alreadyDone });
        return;
      }

      message.channel.send("W00t " + fipo.author.toString() + "!");

      db.run("INSERT INTO fipos (discord_id, date) VALUES (?, ?)", [
        fipo.author.id,
        getAsStringDateWithCorrectTimezoneForReal(
          new Date(fipo.createdTimestamp),
        ),
      ]);
    }, 1000);
  },
});

registerCommand({
  name: "Fipo Statistics",
  command: "fipostats",
  description: "Check the fipo stats",

  handle: async (message, _) => {
    // sorry dit is echt superbrak :D
    db.all("SELECT * FROM fipos", (err, rows) => {
      if (err) {
        console.error(err);
        return;
      }

      if (typeof rows === "undefined" || rows === null) {
        return;
      }

      if (!Array.isArray(rows)) {
        return;
      }

      const fipos = (rows as { discord_id: string; date: string }[]).reduce(
        (acc, row) => {
          const user = (acc[row.discord_id] ?? 0) + 1;
          acc[row.discord_id] = user;

          return acc;
        },
        {} as { [key: string]: number },
      );

      const fiposArray = Object.entries(fipos).map(([discord_id, fipos]) => {
        const name =
          message.guild?.members.cache.get(discord_id)?.displayName ??
          "Unknown";
        return { name, fipos };
      });

      fiposArray.sort((a, b) => b.fipos - a.fipos);

      const longestName = fiposArray.reduce((acc, row) => {
        return Math.max(acc, row.name.length);
      }, 0);

      message.reply({
        allowedMentions: { repliedUser: false, users: [], parse: [] },
        content: `Fipo stats:\n${fiposArray
          .map((r) => {
            return `${r.name.padEnd(longestName + 2)}: ${r.fipos}`;
          })
          .join("\n")}`,
      });
    });
  },
});

registerCommand({
  name: "Fipo Reset",
  command: "fiporeset",
  description: "Reset the fipo stats",
  showInHelp: false,

  handle: async (message, _) => {
    if (message.author.id !== "783447871596920892") {
      message.reply("You are not allowed to do that!");
      return;
    }
    db.run("DELETE FROM fipos", (err) => {
      if (err) {
        console.error(err);
        return;
      }

      todaysFipos = [];
      recordedDate = "0";

      message.reply("Fipo stats reset!");
    });
  },
});

function getAsStringDateWithCorrectTimezoneForReal(date: Date) {
  return date.toLocaleString("nl-NL", {
    timeZone: "Europe/Amsterdam",
    day: "numeric",
    month: "numeric",
    year: "numeric",
  });
}

function getDayOfDateWithCorrectTimezoneForReal(date: Date) {
  return date.toLocaleDateString("nl-NL", {
    day: "numeric",
    timeZone: "Europe/Amsterdam",
  });
}
