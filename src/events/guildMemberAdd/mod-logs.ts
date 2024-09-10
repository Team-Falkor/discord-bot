import {
  EmbedBuilder,
  GuildMember,
  PartialGuildMember,
  TextChannel,
} from "discord.js";
import { Handler } from "../../handler";
import { ClientClass } from "../../structure/Client";

export default function (
  member: GuildMember | PartialGuildMember,
  client: ClientClass,
  handler: Handler
) {
  try {
    if (!member.guild) return;
    if (member.user?.bot) return;

    const modLogs = client.modLogs.get(member.guild.id);
    if (!modLogs) return;
    if (!modLogs.settings?.user_join) return;

    const embed = new EmbedBuilder()
      .setColor("Green")
      .setTitle("User Joined")
      .setAuthor({
        name: member?.user.tag,
        iconURL: member.user.displayAvatarURL(),
      })
      .setDescription(`${member} has joined the server.`)
      .setTimestamp();

    (client.channels.cache.get(modLogs.channelId) as TextChannel)?.send({
      embeds: [embed],
    });
  } catch (error) {
    console.error(error);
    throw new Error((error as Error).message);
  }
}
