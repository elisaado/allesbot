import type { Message } from "discord.js";
import { client } from "../client.ts";
import type { Command } from "../types.ts";

export type BucketContent = {
  lastTS: number;
  count: number;
};

// leaky bucket implementation
const maxBucketSize = 10;
const buckets: Record<string, BucketContent> = {};

export const antiflood: Command = {
  name: "antiflood",
  command: /.+/,
  description: "niet spammen",
  showInHelp: false,
  match: (message: Message) =>
    !(message.author.id === client.user?.id || message.author.bot),
  execute: (message: Message): void => {
    const now = new Date().valueOf();
    let bucket = buckets[message.author.id];

    if (!bucket) {
      bucket = {
        lastTS: now,
        count: 1,
      };

      buckets[message.author.id] = bucket;
      return;
    }

    const elapsed = now - bucket.lastTS;

    // bucket leaks one every 2 seconds, but can never reach below 1
    bucket.count = Math.max(1, bucket.count + 1 - Math.floor(elapsed / 2000));

    // time out user
    if (bucket.count > maxBucketSize) {
      const guildmember = message.mentions.members?.first()
        ? message.mentions.members.first()
        : message.guild?.members.cache.get(message.author.id);

      if (!guildmember) {
        console.log(
          "user is not a guild member somehow?!",
          message.author.globalName,
          message.author.id,
        );
        return;
      }
      guildmember
        .timeout(60 * 1000, "rustig aan aap mannetje")
        .catch((e) => {
          console.log("user timeouten ging fout, wrm?", e, { guildmember });
        });
    }

    buckets[message.author.id] = { ...bucket, lastTS: now };
  },
};
