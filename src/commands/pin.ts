import type { GuildMember, Message } from "discord.js";
import { registerCommand } from "../commandHandler.js";
import env from "../env.js";
import client from "../index.js";

registerCommand({
  name: "pin",
  command: "pin",
  description: "pin een bericht",
  handle: async (message, _) => {
    if (
      message.reference == null ||
      message.reference.messageId == null ||
      message.author.id === client.user?.id
    )
      return await message.reply("omg gebruik dit op een bericht ofz");
    if (!message.member)
      return await message.reply(
        "je moet een lid zijn van de server om dit te doen",
      );

    const msg = await message.fetchReference();
    handlePin(msg, message.member);
  },
});

export async function handlePin(messageToPin: Message, member: GuildMember) {
  if (!member.roles.cache.has(env.BEKEND_ROLE_ID))
    return await messageToPin.reply(
      "ik ben niet jouw vriend, laat dat ook even duidelijk zijn",
    );

  if (messageToPin.author.id === client.user?.id)
    return await messageToPin.reply("ik kan mijn eigen berichten niet pinnen");

  if (messageToPin.pinned)
    return await messageToPin.reply("dit bericht is al gepind aapje");

  await messageToPin.pin();
  await messageToPin.reply("bericht gepind!");
}

export async function handleUnpin(
  messageToUnpin: Message,
  member: GuildMember,
) {
  if (!member.roles.cache.has(env.BEKEND_ROLE_ID))
    return await messageToUnpin.reply(
      "ik ben niet jouw vriend, laat dat ook even duidelijk zijn",
    );

  if (messageToUnpin.author.id === client.user?.id)
    return await messageToUnpin.reply(
      "ik kan mijn eigen berichten niet unpinnen",
    );

  if (!messageToUnpin.pinned)
    return await messageToUnpin.reply("dit bericht is niet gepind aapje");

  await messageToUnpin.unpin();
  await messageToUnpin.reply("bericht unpinned!");
}

registerCommand({
  name: "unpin",
  command: "unpin",
  description: "unpin een bericht",
  handle: async (message, _) => {
    if (
      message.reference == null ||
      message.reference.messageId == null ||
      message.author.id === client.user?.id
    )
      return await message.reply("omg gebruik dit op een bericht ofz");
    if (!message.member)
      return await message.reply(
        "je moet een lid zijn van de server om dit te doen",
      );

    const msg = await message.fetchReference();

    handleUnpin(msg, message.member);
  },
});
