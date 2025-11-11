import { registerCommand } from "../commandHandler.js";
import db from "../db.js";
import client from "../index.js";

registerCommand({
  name: "karma",
  command: ".karma",
  description: "Get karma of something",
  handle: async (message, _) => {
    if (message.author.bot) return;
    const subject = message.content.split(" ").slice(1).join(" ").toLowerCase();
    if (!subject) return;

    const karma = await getKarma(subject);

    message.reply({
      allowedMentions: { repliedUser: false, users: [], parse: [] },
      content: `${subject} has **${karma} karma**`,
    });
  },
});

registerCommand({
  name: "set karma",
  command: /^(.+)((\+\+)|(\-\-))$/,
  description: "Increase or decrease karma of something",
  handle: (message, _) => {
    if (message.author.bot) return;
    const match = message.content.match(/^(.+)((\+\+)|(\-\-))$/);
    if (!match) return;

    const subject = match[1]?.trim();
    if (!subject) return;
    const increase = match[2] === "++";
    if (subject === "karma") {
      message.reply({
        allowedMentions: { repliedUser: false, users: [], parse: [] },
        content: "Ga weg",
      });
      return;
    }

    // copy to new variable to keep original for readability in reply
    const lowerSubject = subject.toLowerCase();

    // TODO: (ooit) dit efficienter (en concurrency safe) maken door het in 1 query (transaction) te doen
    getKarma(lowerSubject).then((karma) => {
      setKarma(lowerSubject, karma + (increase ? 1 : -1)).then(() => {
        message.reply({
          allowedMentions: { repliedUser: false, users: [], parse: [] },
          content: `${subject} now has **${karma + (increase ? 1 : -1)} karma**`,
        });
      });
    });
  },
});

function getKarma(subject: string): Promise<number> {
  if (subject.match(/alles( )?bot/i) || subject.includes("<@1269730382765621288>")) {
    return Promise.resolve(9999999);
  }
  if (subject.match(/typst/i)) {
    return Promise.resolve(9999998);
  }

  return new Promise<number>((resolve, reject) => {
    db.get(
      "SELECT karma FROM karma WHERE subject = ?",
      [subject],
      (err, row) => {
        if (err) {
          console.error(err);
          reject(err);
          return;
        }

        if (typeof row === "undefined" || row === null) {
          resolve(0);
          return;
        }

        // ja joh tuurlijk
        if (typeof row === "object") {
          if ("karma" in row) {
            if (typeof row.karma === "number") {
              resolve(row.karma);
            }
          }
        }

        resolve(0);
      },
    );
  });
}

function setKarma(subject: string, karma: number): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    db.run(
      "INSERT OR REPLACE INTO karma (subject, karma) VALUES (?, ?)",
      [subject, karma],
      (err) => {
        if (err) {
          console.error(err);
          reject(err);
          return;
        }

        resolve();
      },
    );
  });
}
