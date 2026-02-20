import { type ClientEvents, Events, type Message } from "discord.js";

export type Command = {
  name: string;
  command: string | RegExp;
  description: string;
  showInHelp: boolean;
  match: (message: Message) => boolean;
  execute: (message: Message) => MaybePromiseVoid;
};

export const commandGuard = (obj: object) =>
  "name" in obj &&
  typeof obj.name === "string" &&
  "command" in obj &&
  (typeof obj.command === "string" || obj.command instanceof RegExp) &&
  "description" in obj &&
  typeof obj.description === "string" &&
  "showInHelp" in obj &&
  typeof obj.showInHelp === "boolean" &&
  "match" in obj &&
  typeof obj.match === "function" &&
  "execute" in obj &&
  typeof obj.execute === "function";

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
