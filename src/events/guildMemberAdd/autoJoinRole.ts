import { GuildMember } from "discord.js";
import { ClientClass } from "../../structure/Client";

export default async function (member: GuildMember, client: ClientClass) {
  if (member.user.bot) return;

  const db = client.db.autoJoinRoles;

  const data = await db.findMany({
    where: {
      guild_id: member.guild.id,
    },
  });

  if (!data) return;

  const guild = await client.guilds.cache.get(member.guild.id);
  const memberToGiveRole = await guild?.members.cache.get(member.id);

  try {
    data.forEach(async (item) => {
      await memberToGiveRole?.roles.add(item.role);
    });
  } catch (error) {
    return;
  }
}
