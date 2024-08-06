import type { Message } from "discord.js";

export type Handler = {
  handle: (message: Message, args: string[]) => void;
  name: string;
  description: string;
};

const handlers: Record<string, Handler> = {};

export const registerCommand = (command: string, handler: Handler) => {
  if (handlers[command.toLowerCase()]) {
    throw new Error(`Command already exists: ${command}`);
  }
  handlers[command.toLowerCase()] = handler;
};

export const handleCommand = (
  command: string,
  message: Message,
  args: string[]
) => {
  const handler = handlers[command.toLowerCase()];
  if (!handler) {
    console.error(`Command not found: ${command}`);
    return;
  }

  handler.handle(message, args);
};

export const getHandlers = () => handlers;
