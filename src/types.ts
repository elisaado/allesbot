import { type ClientEvents, Events, type Message } from "discord.js";

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

export type BotEvent<T extends keyof ClientEvents> = {
  type: T;
  once?: boolean;
  execute: (...args: ClientEvents[T]) => void;
};

export const botEventGuard = (object: object) =>
  "type" in object &&
  "execute" in object &&
  Object.values(Events).includes(object.type as Events);

export type MaybePromiseVoid = void | Promise<void>;
