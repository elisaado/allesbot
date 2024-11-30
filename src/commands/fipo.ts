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
      new Date().toLocaleDateString("nl-NL", { day: "numeric" })
    ) {
      recordedDate = new Date().toLocaleDateString("nl-NL", { day: "numeric" });
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

      db.run("INSERT OR IGNORE INTO fipo (discord_id, fipos) VALUES (?, 0)", [
        fipo.author.id,
      ]);

      db.run(
        "UPDATE fipo SET fipos = fipos + 1 WHERE discord_id = ?",
        [fipo.author.id],
        (err) => {
          if (err) {
            console.error(err);
            return;
          }
        },
      );
    }, 1000);
  },
});

registerCommand({
  name: "Fipo Statistics",
  command: "fipostats",
  description: "Check the fipo stats",

  handle: async (message, _) => {
    // sorry dit is echt superbrak :D
    db.all("SELECT * FROM fipo", (err, rows) => {
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

      const fipos = (rows as { discord_id: string; fipos: number }[])
        .sort((a, b) => b.fipos - a.fipos)
        .reduce(
          (
            acc: {
              rows: { fipos: number; name: string }[];
              longestName: number;
            },
            r,
          ) => {
            const user = message.guild?.members.cache.get(r.discord_id)?.user;
            if (!user) {
              return acc;
            }

            const name = user.username;
            const longestName = Math.max(acc.longestName, name.length);

            acc.rows.push({ name, fipos: r.fipos });
            acc.longestName = longestName;

            return acc;
          },
          { rows: [], longestName: 0 },
        );

      const stats = fipos.rows
        .map((r) => {
          return `${r.name.padEnd(fipos.longestName + 2)}: ${r.fipos}`;
        })
        .join("\n");

      message.reply({
        allowedMentions: { repliedUser: false, users: [], parse: [] },
        content: `Fipo stats:\n${stats}`,
      });
    });
  },
});
