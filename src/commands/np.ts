import { EmbedBuilder, type Message } from "discord.js";
import type {
  Command,
  LastFMData,
  LastFMTrack,
  Track,
} from "../customTypes.ts";
import { db } from "../db.ts";
import { env } from "../env.ts";

export const np: Command = {
  name: "np",
  command: ".np",
  description: "Shows your or someone else's currently playing track",
  showInHelp: true,
  match: (message: Message) => message.content.split(" ")[0] === ".np",
  execute: async (message: Message): Promise<void> => {
    let lastFMUsername = message.content.split(" ").slice(1).join();

    // Check of er een arg is
    if (lastFMUsername === "") {
      const thing = db
        .sql`SELECT lastfm_username FROM users WHERE discord_id = ${message.author.id}`;

      console.log(thing);

      // als thing undefined is, is er geen username in de db
      if (thing[0].lastfm_username === undefined) {
        message.reply("jij hebt geen username, kameraad");
        return;
      }

      lastFMUsername = thing[0].lastfm_username;
    } else if (
      db.sql`SELECT discord_id FROM users WHERE lastfm_username = ${lastFMUsername}`
        === undefined
    ) {
      message.reply("die username heb ik niet, maat");
      return;
    }

    const baseUrl =
      `http://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${lastFMUsername}&api_key=${env.LASTFM_API_KEY}&format=json`;
    const response = await fetch(baseUrl);

    if (!response.ok) {
      message.reply("Er ging iets mis owo :3");
      return;
    }

    const lastFMData: LastFMData = await response.json();
    const dataIWant: LastFMTrack[] = lastFMData.recenttracks.track;

    if (
      dataIWant.length === 0 || !dataIWant[0] || !dataIWant[0]["@attr"]
      || !dataIWant[0]["@attr"].nowplaying
    ) {
      message.reply("dan moet je wel muziek aan zetten jij zukkel");
      return;
    }

    const nowPlaying: Track = {
      name: dataIWant[0].name,
      album: dataIWant[0].album["#text"],
      artist: dataIWant[0].artist["#text"],
      image: dataIWant[0].image[3]["#text"],
      url: dataIWant[0].url,
    };

    const pfpURL = message.author.avatarURL()
      ?? message.author.defaultAvatarURL;

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
  command: ".setnpuser",
  description: "Sets the Last.fm username",
  showInHelp: true,
  match: (message: Message) => message.content.split(" ")[0] === ".setnpuser",
  execute: (message: Message): void => {
    const lastFMUsername: string = message.content.split(" ").slice(1).join();

    if (lastFMUsername === "") {
      message.reply("Dan moet je ook wel een username geven slimmerik");
      return;
    }

    try {
      db.sql`DELETE FROM users WHERE discord_id = ${message.author.id}`;

      db.sql`INSERT INTO users (discord_id, lastfm_username) VALUES (${message.author.id}, ${lastFMUsername})`;
    } catch (err) {
      console.error(err);
      message.reply("wtf er ging iets mis ofzo?");
      return;
    }

    message.reply(
      `Je nieuwe username is ${lastFMUsername}, geniet er maar van`,
    );
  },
};
