import type { Message } from "discord.js";
import { registerCommand } from "../commandHandler.js";
import db from "../db.js";

let todaysFipos: Message<boolean>[] = [];
let recordedDate = "0";

registerCommand({
  name: "fipo",
  command: "fipo",
  description: "do the fipo!",
  handle: (message, _) => {
    if (message.author.bot) return;

    // check if we need to reset the fipo
    if (
      recordedDate !==
      new Date().toLocaleDateString("nl-NL", {
        day: "numeric",
        timeZone: "Europe/Amsterdam",
      })
    ) {
      recordedDate = new Date().toLocaleDateString("nl-NL", {
        day: "numeric",
        timeZone: "Europe/Amsterdam",
      });

      todaysFipos = [];
    }

    todaysFipos.push(message);

    if (todaysFipos.length > 1) {
      // setTimeout already running or fipo already done, no need to start it
      return;
    }

    // wait 1 seconds to allow more fipos to come in, then grab the earliest one
    setTimeout(() => {
      const fipo = todaysFipos.sort((a, b) => {
        return a.createdTimestamp - b.createdTimestamp;
      })[0];

      if (!fipo) {
        console.error("no fipo found in timeout");
        return;
      }

      message.channel.send("W00t " + fipo.author.toString() + "!");

      db.run("INSERT INTO fipos (discord_id, date) VALUES (?, ?)", [
        fipo.author.id,
        new Date(fipo.createdTimestamp).toISOString(),
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
