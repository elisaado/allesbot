import { ActivityType, type Client, Events } from "discord.js";
import type { BotEvent } from "../types.ts";

export const readyEvent: BotEvent = {
  type: Events.ClientReady,
  execute: (client: Client<boolean>): void => {
    console.log(`Ready! Logged in as ${client.user?.tag}`);
    client.user?.setActivity("We almost up", {
      type: ActivityType.Custom,
    });
  },
};
