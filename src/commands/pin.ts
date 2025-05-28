import { registerCommand } from "../commandHandler.js";
import env from "../env.js";
import client from "../index.js";

registerCommand({
  name: "pin",
  command: "pin",
  description: "pin een bericht",
  handle: async (message, _) => {
    if (!message.member?.roles.cache.has(env.BEKEND_ROLE_ID))
      return await message.reply(
        "ik ben niet jouw vriend, laat dat ook even duidelijk zijn",
      );

    if (
      message.reference == null ||
      message.reference.messageId == null ||
      message.author.id === client.user?.id
    )
      return await message.reply("omg gebruik dit op een bericht ofz");

    const msg = await message.fetchReference();
    if (msg.pinned) return message.reply("dit bericht is al gepind aapje");

    await msg.pin();
  },
});

registerCommand({
  name: "unpin",
  command: "unpin",
  description: "unpin een bericht",
  handle: async (message, _) => {
    if (!message.member?.roles.cache.has(env.BEKEND_ROLE_ID))
      return await message.reply(
        "ik ben niet jouw vriend, laat dat ook even duidelijk zijn",
      );

    if (
      message.reference == null ||
      message.reference.messageId == null ||
      message.author.id === client.user?.id
    )
      return await message.reply("omg gebruik dit op een bericht ofz");

    const msg = await message.fetchReference();
    if (!msg.pinned) return message.reply("dit bericht is niet gepind aapje");

    await msg.unpin();
    await message.reply("jo, succes met je leven");
  },
});
