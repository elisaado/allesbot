import type { Events, Message } from "discord.js";

export type Command = {
  name: string;
  command: string | RegExp;
  description: string;
  showInHelp: boolean;
  match: (message: Message) => boolean;
  execute: (message: Message) => MaybePromiseVoid;
};

export const CommandGuard = (object: object) =>
  "match" in object
  && "execute" in object;

export type BotEvent = {
  type: Events;
  once?: boolean;
  // deno-lint-ignore no-explicit-any
  execute: (...args: any[]) => void;
  // These types and parameters differ wildly, I also don't want to use any but I have no choice
};

export const BotEventGuard = (object: object) =>
  "type" in object && "execute" in object;

export type MaybePromiseVoid = void | Promise<void>;

export type UrbanDictionaryEntry = {
  author: string;
  current_vote: string;
  defid: number;
  definition: string;
  example: string;
  permalink: string;
  thumbs_down: number;
  thumbs_up: number;
  word: string;
  written_on: string;
};

export type UrbanDictionaryResponse = {
  list: UrbanDictionaryEntry[];
};

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
