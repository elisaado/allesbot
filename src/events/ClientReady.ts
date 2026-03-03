import { BotEvent } from "$src/types.ts";
import { ActivityType, type Client, Events } from "discord.js";

export const readyEvent = new BotEvent<Events.ClientReady>({
  type: Events.ClientReady,
  once: true,
  execute: (client: Client<true>) => {
    console.log(`Ready! Logged in as ${client.user.tag}`);
    client.user.setActivity("We almost up", {
      type: ActivityType.Custom,
    });
  },
});
