import {
  DMChannel,
  EmbedBuilder,
  GuildBan,
  NewsChannel,
  TextChannel,
} from "discord.js";
import { Handler } from "../../handler";
import { ClientClass } from "../../structure/Client";

export default function (ban: GuildBan, client: ClientClass, handler: Handler) {
  try {
    if (!ban.guild) return;
    if (ban.user?.bot) return;

    const modLogs = client.modLogs.get(ban.guild.id);
    if (!modLogs) return;
    if (!modLogs.settings?.user_ban) return;

    const embed = new EmbedBuilder()
      .setColor("Green")
      .setTitle("User Unbanned")
      .setAuthor({
        name: ban?.user.username,
        iconURL: ban.user.displayAvatarURL(),
      })
      .setDescription(`${ban.user} has been unbanned.`)
      .setTimestamp();

    const channel = client.channels.cache.get(modLogs.channelId);

    if (
      !(
        channel instanceof TextChannel ||
        channel instanceof DMChannel ||
        channel instanceof NewsChannel
      )
    )
      return;

    channel?.send({
      embeds: [embed],
    });
  } catch (error) {
    console.error(error);
  }
}
