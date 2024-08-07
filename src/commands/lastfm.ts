import env from "../env.js";

import { registerCommand } from "../commandHandler.js";
import SimpleFM from "@solely/simple-fm";
import db from "../db.js";

const client = new SimpleFM(env.LASTFM_API_KEY);

registerCommand("np", {
  name: "np",
  description: "Shows your or someone else's currently playing track",
  handle: async (message, args) => {
    function getUsername(): Promise<string | null> {
      return new Promise((resolve, reject) => {
        db.get(
          "SELECT lastfm_username FROM users WHERE discord_id = ?",
          [message.author.id],
          (err, row) => {
            if (err) {
              reject(err);
              return;
            }
            if (typeof row === "undefined" || row === null) {
              resolve(null);
              return;
            }

            if (typeof row === "object") {
              if ("lastfm_username" in row) {
                if (typeof row.lastfm_username === "string") {
                  resolve(row.lastfm_username);
                }
              }
            }

            resolve(null);
          }
        );
      });
    }

    const username = args[0] !== undefined ? args[0] : await getUsername();
	const usernameByArgs = args[0] !== undefined;

    if (!username) {
      message.reply("No Last.fm username set. Use `setnpuser` to set it. You can also use `np <username>` to get the currently playing track of a different user.");
      return;
    }

    const json = await client.user.getRecentTracks({
      username,
    });
    const track = json.tracks[0];

    if (json.search.nowPlaying && track) {
      message.reply({
        embeds: [
          {
            author: {
              name: `${usernameByArgs ? username : ""} •  Now Playing`,
              icon_url: usernameByArgs ? undefined : message.author.displayAvatarURL(),
            },
            title: track.name,
            description: `**${track.artist?.name}** on *${track.album?.name}*`,
            url: track.url,
            thumbnail: {
              url: (track as any).image[2].url,
            },
          },
        ],
      });
    } else {
      message.reply("No track is currently playing");
    }
  },
});

registerCommand("setnpuser", {
  name: "setnpuser",
  description: "Sets the Last.fm username",
  handle: async (message, args) => {
    if (args.length === 0) {
      message.reply("Please provide a username");
      return;
    }

    db.run(
      "INSERT INTO users (discord_id, lastfm_username) VALUES (?, ?) ON CONFLICT(discord_id) DO UPDATE SET lastfm_username = ?",
      [message.author.id, args[0], args[0]]
    );
    message.reply(`Username set to ${args[0]}`);
  },
});
