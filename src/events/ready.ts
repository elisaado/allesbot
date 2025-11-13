import { type Client, Events } from "discord.js";
import type { BotEvent } from "../customTypes.ts";

export const readyEvent: BotEvent = {
  type: Events.ClientReady,
  execute: (client: Client<boolean>): void => {
    console.log(`Ready! Logged in as ${client.user?.tag}`);
  },
};
