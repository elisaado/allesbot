import type { Events, Message } from "discord.js";

export type Command = {
  name: string;
  command: string | RegExp;
  description: string;
  showInHelp: boolean;
  match?: (message: Message) => boolean;
  execute: (message: Message) => MaybePromiseVoid;
};

export const isCommand = (object: object) =>
  "match" in object && "execute" in object;

export type BotEvent = {
  type: Events;
  once?: boolean;
  // deno-lint-ignore no-explicit-any
  execute: (...args: any[]) => void;
  // These types and parameters differ wildly, I also don't want to use any but I have no choice
};

export const isBotEvent = (object: object) =>
  "type" in object && "execute" in object;

export type MaybePromiseVoid = void | Promise<void>;
