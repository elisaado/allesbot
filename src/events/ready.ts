import type { BotEvent } from "../customTypes.ts";
import { type Client, Events } from "discord.js";

export const readyEvent: BotEvent = {
  type: Events.ClientReady,
  execute: (client: Client<boolean>): void => {
    console.log(`Ready! Logged in as ${client.user?.tag}`);
  },
};
