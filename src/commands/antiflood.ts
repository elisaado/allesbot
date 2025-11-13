import type { Message } from "discord.js";
import { client } from "../client.ts";
import type { BucketContent, Command } from "../customTypes.ts";

// leaky bucket implementation
const max_bucket_size: number = 10 as const;
const buckets: Record<string, BucketContent> = {};

export const antiflood: Command = {
  name: "antiflood",
  command: /.+/,
  description: "niet spammen",
  showInHelp: false,
  match: (message: Message) => message.author.id === client.user?.id,
  execute: (message: Message): void => {
    if (message.author.bot) return;
    const now: number = new Date().valueOf();
    let bucket: BucketContent = buckets[message.author.id];

    if (!bucket) {
      bucket = {
        lastTS: now,
        count: 1,
      };

      buckets[message.author.id] = bucket;
      return;
    }

    const elapsed: number = now - bucket.lastTS;

    // bucket leaks one every 2 seconds, but can never reach below 1
    bucket.count = Math.max(1, bucket.count + 1 - Math.floor(elapsed / 2000));

    console.log({ bucket });

    // time out user
    if (bucket.count > max_bucket_size) {
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
