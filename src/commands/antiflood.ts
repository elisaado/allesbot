import type { Message } from "discord.js";
import { client } from "../client.ts";
import type { Command } from "../types.ts";

export type BucketContent = {
  lastTS: number;
  count: number;
};

// leaky bucket implementation
const maxBucketSize = 10 as const;
const buckets: Record<string, BucketContent> = {};

export const antiflood: Command = {
  name: "antiflood",
  command: /.+/,
  description: "niet spammen",
  showInHelp: false,
  match: (message: Message) =>
    !(message.author.id === client.user?.id || message.author.bot),
  execute: async (message: Message) => {
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
      const member = message.mentions.members?.first()
        ? message.mentions.members.first()
        : message.guild?.members.cache.get(message.author.id);

      if (!member) {
        console.log(
          "user is not a guild member somehow?!",
          message.author.globalName,
          message.author.id,
        );
        return;
      }
      await member
        .timeout(60 * 1000, "rustig aan aap mannetje")
        .catch((err) => {
          console.log("user timeouten ging fout, wrm?", err, { member });
        });
    }

    buckets[message.author.id] = { ...bucket, lastTS: now };
  },
};
