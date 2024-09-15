import { EmbedBuilder, TextChannel, type Message } from "discord.js";
import { Handler } from "../../handler";
import { ClientClass } from "../../structure/Client";

export default function (
  message: Message<true>,
  client: ClientClass,
  handler: Handler
) {
  try {
    if (!message.guild) return;
    if (message.author?.bot) return;

    const modLogs = client.modLogs.get(message.guild.id);
    if (!modLogs) return;
    if (!modLogs.settings?.deleted_message) return; // check i

    const embed = new EmbedBuilder()
      .setColor("Red")
      .setTitle("Message Deleted")
      .setAuthor({
        name: message?.author?.tag,
        iconURL: message.author.displayAvatarURL(),
      })
      .addFields(
        {
          name: "Content",
          value:
            message.cleanContent.length < 1 ? "Unknown" : message.cleanContent,
        },
        {
          name: "Channel",
          value: message?.channel?.toString() ?? "Unknown",
          inline: true,
        },
        {
          name: "Author",
          value: message?.author?.toString() ?? "Unknown",
          inline: true,
        }
      )
      .setTimestamp();

    (client.channels.cache.get(modLogs.channelId) as TextChannel)?.send({
      embeds: [embed],
    });
  } catch (error) {
    console.error(error);
  }
}
