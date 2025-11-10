import { registerCommand } from "../commandHandler.js";

// period in miliseconds
const period = 10_000;
// max messages a user is allowed to send
const max_per_period = 10;
// map of userID to an object with their last timestamp and their count of messages in a $period second timespan
// when date() - lastTS > period, count is reset to 0, when count > max_per_period, user receives a timeout of 60 seconds
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

    if (now - bucket.lastTS > period) {
      bucket.count = 0;
    } else {
      bucket.count += 1;
    }

    if (bucket.count > max_per_period) {
      let guildmember = await message.guild?.members.fetch(message.author.id);
      if (!guildmember) {
        console.log(
          "user is not a guild member somehow?!",
          message.author.globalName,
          message.author.id,
        );
        return;
      }
      await guildmember.timeout(60 * 1000).catch((e) => {
        console.log("user timeouten ging fout, wrm?", e);
      });
    }

    buckets[message.author.id] = bucket;
  },
});
