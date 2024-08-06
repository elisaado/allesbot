import { registerCommand } from "../commandHandler.js";

registerCommand("ping", {
  name: "ping",
  description: "Replies with pong and the latency",
  handle: (message, _) => {
    const now = Date.now();
    const diff = now - message.createdTimestamp;
    message.reply(`Pong! Latency: ${diff}ms`);
  },
});

registerCommand("editPing", {
  name: "editPing",
  description: "Measures the latency by editing the message",
  handle: (message, _) => {
    message.channel.send("Pinging...").then((sent) => {
      const now = Date.now();
      const diff = now - sent.createdTimestamp;
      sent.edit(`Pong! Latency: ${diff}ms`);
    });
  },
});
