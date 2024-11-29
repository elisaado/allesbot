import type { Message } from "discord.js";
import { registerCommand } from "../commandHandler.js";
import db from "../db.js";

let todaysFipos: Message<boolean>[] = [];
let recordedDate = 0;

registerCommand({
  name: "fipo",
  command: "fipo",
  description: "do the fipo!",
  handle: (message, _) => {
    if (message.author.bot) return;

    // check if we need to reset the fipo
    if (recordedDate !== new Date().getDate()) {
      recordedDate = new Date().getDate();
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
