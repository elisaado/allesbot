import { type ClientEvents, Events, type Message } from "discord.js";

export interface CommandConstruct {
  name: string;
  command: string | RegExp;
  description: string;
  showInHelp: boolean;
  match: (message: Message) => boolean;
  execute: (message: Message) => MaybePromiseVoid;
}

export class Command {
  name: string;
  command: string | RegExp;
  description: string;
  showInHelp: boolean;
  match: (message: Message) => boolean;
  execute: (message: Message) => MaybePromiseVoid;

  constructor(obj: CommandConstruct) {
    this.name = obj.name;
    this.command = obj.command;
    this.description = obj.description;
    this.showInHelp = obj.showInHelp;
    this.match = obj.match;
    this.execute = obj.execute;
  }
}

export interface BotEvent<T extends keyof ClientEvents> {
  type: T;
  once?: boolean;
  execute: (...args: ClientEvents[T]) => void;
}

export const botEventGuard = (object: object) =>
  "type" in object &&
  "execute" in object &&
  Object.values(Events).includes(object.type as Events);

export type MaybePromiseVoid = void | Promise<void>;
