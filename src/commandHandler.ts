import type { Message } from "discord.js";
import { command } from "neovim/lib/plugin/command.js";

export type Handler = {
  handle: (message: Message, args: string[]) => void;
  name: string;
  custom?: false;
  description: string;
  command: string | RegExp;
};

export type CustomHandler = Omit<Handler, "custom"> & {
  custom: true;
};

const handlers: Record<string, Handler | CustomHandler> = {};
const regexHandlers: Omit<Handler, "custom">[] = [];

export const registerCommand = (handler: CustomHandler | Handler) => {
  const { command } = handler;
  if (typeof command === "string") {
    if (handlers[command.toLowerCase()]) {
      throw new Error(`ommand already exists: ${command}`);
    }
    handlers[command.toLowerCase()] = handler;
    return;
  }
  regexHandlers.push(handler);
};

export const handleCommand = (message: Message) => {
  const content = message.content.split(" ");
  const prefixedCommand = content[0]?.toLowerCase();
  if (content.length === 0 || !prefixedCommand || prefixedCommand == null)
    return;
  if (prefixedCommand[0] === ".") {
    const command = prefixedCommand.slice(1);

    const handler = handlers[command.toLowerCase()];
    if (handler) {
      handler.handle(message, content.slice(1));
      return;
    }
  }

  regexHandlers.find((handler) => {
    if (handler.command instanceof RegExp) {
      if (handler.command.test(prefixedCommand)) {
        handler.handle(message, content.slice(1));
        return true;
      }
    }
  });
};

export const getHandlers = () => handlers;
export const getRegexHandlers = () => regexHandlers;
