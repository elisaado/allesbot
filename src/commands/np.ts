import { db } from "$src/db.ts";
import env from "$src/env.ts";
import type { Command } from "$src/types.ts";
import { EmbedBuilder, type Message } from "discord.js";

export type Track = {
  name: string;
  album: string;
  artist: string;
  image: string;
  url: string;
};

export type LastFMTrack = {
  artist: {
    mbid: string;
    "#text": string;
  };
  streamable: string;
  image: {
    size: string;
    "#text": string;
  }[];
  mbid: string;
  album: {
    mbid: string;
    "#text": string;
  };
  name: string;
  url: string;
  date?: {
    uts: string;
    "@attr": string;
  };
  "@attr"?: {
    nowplaying: boolean;
  };
};

export type LastFMData = {
  recenttracks: {
    track: LastFMTrack[];
    "@attr": {
      user: string;
      totalPages: string;
      page: string;
      perPage: string;
      total: string;
    };
  };
};

export const np: Command = {
  name: "np",
  command: "np",
  description: "Shows your or someone else's currently playing track",
  showInHelp: true,
  match: (message: Message) =>
    message.content.split(" ")[0] === env.PREFIX + np.command,
  execute: async (message: Message) => {
    let lastFMUsername = message.content.split(" ").slice(1).join();

    // Check of er een arg is
    if (!lastFMUsername) {
      lastFMUsername =
        db.sql`SELECT lastfm_username FROM users WHERE discord_id = ${message.author.id}`[0]
          .lastfm_username;

      // als thing undefined is, is er geen username in de db
      if (!lastFMUsername) {
        await message.reply("jij hebt geen username, kameraad");
        return;
      }
    } else if (
      !db.sql`SELECT discord_id FROM users WHERE lastfm_username = ${lastFMUsername}`[0]
    ) {
      await message.reply("die username heb ik niet, maat");
      return;
    }

    const baseUrl = `http://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${lastFMUsername}&api_key=${env.LASTFM_API_KEY}&format=json`;
    const response = await fetch(baseUrl);

    if (!response.ok) {
      await message.reply("Er ging iets mis owo :3");
      return;
    }

    const lastFMData: LastFMData = await response.json();
    const recentlyPlayed: LastFMTrack[] = lastFMData.recenttracks.track;

    if (!recentlyPlayed?.[0]?.["@attr"]?.nowplaying) {
      await message.reply("dan moet je wel muziek aan zetten jij zukkel");
      return;
    }

    const nowPlaying: Track = {
      name: recentlyPlayed[0].name,
      album: recentlyPlayed[0].album["#text"],
      artist: recentlyPlayed[0].artist["#text"],
      image: recentlyPlayed[0].image[3]["#text"],
      url: recentlyPlayed[0].url,
    };

    const pfpURL =
      message.author.avatarURL() ?? message.author.defaultAvatarURL;

    const trackEmbed = new EmbedBuilder()
      .setTitle(nowPlaying.name)
      .setURL(nowPlaying.url)
      .setAuthor({
        name: "•  Now Playing",
        iconURL: pfpURL,
      })
      .setThumbnail(nowPlaying.image)
      .setDescription(`**${nowPlaying.artist}** on _${nowPlaying.album}_`);

    message.reply({
      embeds: [trackEmbed],
    });
  },
};

export const setNPUser: Command = {
  name: "setnpuser",
  command: "setnpuser",
  description: "Sets the Last.fm username",
  showInHelp: true,
  match: (message: Message) =>
    message.content.split(" ")[0] === env.PREFIX + setNPUser.command,
  execute: async (message: Message) => {
    const lastFMUsername: string = message.content.split(" ").slice(1).join();

    if (lastFMUsername === "") {
      await message.reply("Dan moet je ook wel een username geven slimmerik");
      return;
    }

    try {
      db.sql`DELETE FROM users WHERE discord_id = ${message.author.id}`;

      db.sql`INSERT INTO users (discord_id, lastfm_username) VALUES (${message.author.id}, ${lastFMUsername})`;
    } catch (err) {
      console.error(err);
      await message.reply("wtf er ging iets mis ofzo?");
      return;
    }

    await message.reply(
      `Je nieuwe username is ${lastFMUsername}, geniet er maar van`,
    );
  },
};
