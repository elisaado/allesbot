import { registerCommand } from "../commandHandler.js";

registerCommand({
  name: "year progress",
  command: "yp",
  description: "hoe ver is het jaar",
  handle: (message, _) => {
    const now = Date.now();
    const diff = now - message.createdTimestamp;
    const date = new Date();
    const start = Date.UTC(date.getFullYear(), 0, 0);
    const end = Date.UTC(date.getFullYear() + 1, 0, 0);
    const currentDay =
      (Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) - start) /
      24 /
      60 /
      60 /
      1000;
    const maxDay = (end - start) / 24 / 60 / 60 / 1000;

    message.reply(
      `We zijn al ysu **${((currentDay / maxDay) * 100).toFixed(1)}%** in het jaar`,
    );
  },
});
