import {
  ContextMenuCommandInteraction,
  MessageContextMenuCommandInteraction,
  type GuildMember,
  type Message,
} from "discord.js";
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

export async function handlePin(
  messageToPin: Message | MessageContextMenuCommandInteraction,
  member: GuildMember,
) {
  const msg =
    messageToPin instanceof ContextMenuCommandInteraction
      ? messageToPin.targetMessage
      : messageToPin;

  if (!member.roles.cache.has(env.BEKEND_ROLE_ID))
    return await messageToPin.reply(
      "ik ben niet jouw vriend, laat dat ook even duidelijk zijn",
    );

  if (msg.pinned)
    return await messageToPin.reply("dit bericht is al gepind aapje");

  await msg.pin();
  await messageToPin.reply(`bericht gepind door <@${member.id}>!`);
}

export async function handleUnpin(
  messageToUnpin: Message | MessageContextMenuCommandInteraction,
  member: GuildMember,
) {
  const msg =
    messageToUnpin instanceof ContextMenuCommandInteraction
      ? messageToUnpin.targetMessage
      : messageToUnpin;

  if (!member.roles.cache.has(env.BEKEND_ROLE_ID))
    return await messageToUnpin.reply(
      "ik ben niet jouw vriend, laat dat ook even duidelijk zijn",
    );

  if (!msg.pinned)
    return await messageToUnpin.reply("dit bericht is niet gepind aapje");

  await msg.unpin();
  await messageToUnpin.reply(`bericht geunpind door <@${member.id}>!`);
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
