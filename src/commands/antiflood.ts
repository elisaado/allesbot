import { registerCommand } from "../commandHandler.js";

// leaky bucket implementation
const max_bucket_size = 10;
const buckets: Record<
  string,
  {
    lastTS: number;
    count: number;
  }
> = {};

registerCommand({
  name: "antiflood",
  command: /.+/,
  description: "niet spammen",
  showInHelp: false,
  handle: async (message, args) => {
    if (message.author.bot) {
      return;
    }
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

    let elapsed = now - bucket.lastTS;

    // bucket leaks one every 2 seconds, but can never reach below 1
    bucket.count = Math.max(1, bucket.count + 1 - Math.floor(elapsed / 2000));

    console.log({ bucket });

    // time out user
    if (bucket.count > max_bucket_size) {
      let guildmember;
      if (message.mentions.members?.first()) {
        guildmember = message.mentions.members.first();
      } else {
        guildmember = await message.guild?.members.cache.get(message.author.id);
      }
      if (!guildmember) {
        console.log(
          "user is not a guild member somehow?!",
          message.author.globalName,
          message.author.id,
        );
        return;
      }
      await guildmember
        .timeout(60 * 1000, "rustig aan aap mannetje")
        .catch((e) => {
          console.log("user timeouten ging fout, wrm?", e, { guildmember });
        });
    }

    buckets[message.author.id] = { ...bucket, lastTS: now };
  },
});
