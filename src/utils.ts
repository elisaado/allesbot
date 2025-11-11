import { EmbedBuilder } from "discord.js";
import type { Track } from "./customTypes.ts";

export function trackEmbedBuilder(
  trackPlaying: Track,
  pfp: string,
): EmbedBuilder {
  return new EmbedBuilder()
    .setTitle(trackPlaying.name)
    .setURL(trackPlaying.url)
    .setAuthor({
      name: "•  Now Playing",
      iconURL: pfp,
    })
    .setThumbnail(trackPlaying.image)
    .setDescription(`**${trackPlaying.artist}** on _${trackPlaying.album}_`);
}
