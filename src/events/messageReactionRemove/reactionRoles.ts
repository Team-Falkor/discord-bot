import {
  MessageReaction,
  MessageReactionEventDetails,
  PartialMessageReaction,
  PartialUser,
  User,
} from "discord.js";
import { ClientClass } from "../../structure/Client";

export default async function (
  reaction: MessageReaction | PartialMessageReaction,
  user: User | PartialUser,
  _details: MessageReactionEventDetails,
  client: ClientClass
) {
  if (!reaction.message.guildId) return;
  if (user.bot) return;

  let cID = `<${reaction.emoji.name}:${reaction.emoji.id}>`;
  if (!reaction.emoji.id) cID = reaction.emoji.name!;

  const db = client.db.reaction;

  const data = await db.findFirst({
    where: {
      guildId: reaction.message.guild!.id,
      messageId: reaction.message.id,
      emoji: cID,
    },
  });

  if (!data) return;

  const guild = await client.guilds.cache.get(reaction.message.guildId);
  const member = await guild?.members.cache.get(user.id);

  try {
    await member?.roles.remove(data.role);
  } catch (error) {
    return;
  }
}
