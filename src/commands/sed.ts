import { registerCommand } from "../commandHandler.js";
import client from "../index.js";

registerCommand({
  name: "sed",
  command: /^.s\/.*\/.*(\/.*)?$/,
  description: "Use sed to replace text in the replied to message",
  handle: (message, _) => {
    if (
      message.reference == null ||
      message.reference.messageId == null ||
      message.author.id === client.user?.id
    ) {
      return;
    }

    const match = message.content.match(/^\.s\/(.*)\/(.*)(\/(.*))?$/);
    if (!match) {
      return;
    }

    const [, find, replace] = match;
    if (find == null || replace == null) {
      return;
    }
    const reply = message.channel.messages.cache.get(
      message.reference.messageId,
    );
    if (reply?.author.id === client.user?.id) {
      return;
    }

    if (reply == null) {
      return;
    }

    const newContent = reply.content.replace(new RegExp(find, "g"), replace);
    if (newContent.length > 1000) {
      message.reply("Resulting message is te lang aapje");
      return;
    }
    reply.reply({
      allowedMentions: { repliedUser: false },
      content: `Did you mean:\n${newContent}`,
    });
  },
});
