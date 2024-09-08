import {
  MessageReaction,
  PartialMessageReaction,
  PartialUser,
  User,
} from "discord.js";
import { ClientClass } from "../../structure/Client";

export default async function (
  reaction: MessageReaction | PartialMessageReaction,
  user: User | PartialUser,
  client: ClientClass
) {
  if (!reaction.message.guildId) return;
  if (user.bot) return;

  let cID = `<${reaction.emoji.name}:${reaction.emoji.id}>`;
  if (!reaction.emoji.id) cID = reaction.emoji.name!;

  const db = client.db.reaction;

  const data = await db.findFirst({
    where: {
      guild_id: reaction.message.guild!.id,
      message_id: reaction.message.id,
      emoji: cID,
    },
  });

  if (!data) return;

  const guild = await client.guilds.cache.get(reaction.message.guildId);
  const member = await guild?.members.cache.get(user.id);

  try {
    await member?.roles.add(data.role);
  } catch (error) {
    return;
  }
}
