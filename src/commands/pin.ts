import { registerCommand } from "../commandHandler.js";
import client from "../index.js";

const BEKEND_ROLE_ID = "1270735977438253066";

registerCommand({
  name: "pin",
  command: "pin",
  description: "pin een bericht",
  handle: async (message, _) => {
    if (!message.member?.roles.cache.has(BEKEND_ROLE_ID))
      return message.reply(
        "ik ben niet jouw vried, laat dat ook even duidelijk zijn",
      );

    if (
      message.reference == null ||
      message.reference.messageId == null ||
      message.author.id === client.user?.id
    )
      return message.reply("omg gebruik dit op een bericht ofz");

    const msg = await message.fetchReference();
    if (msg.pinned) return message.reply("dit bericht is al gepind aapje");

    msg.pin();
  },
});

registerCommand({
  name: "unpin",
  command: "unpin",
  description: "unpin een bericht",
  handle: async (message, _) => {
    if (!message.member?.roles.cache.has(BEKEND_ROLE_ID))
      return message.reply(
        "ik ben niet jouw vried, laat dat ook even duidelijk zijn",
      );

    if (
      message.reference == null ||
      message.reference.messageId == null ||
      message.author.id === client.user?.id
    )
      return message.reply("omg gebruik dit op een bericht ofz");

    const msg = await message.fetchReference();
    if (!msg.pinned) return message.reply("dit bericht is niet gepind aapje");

    msg.unpin();
  },
});
