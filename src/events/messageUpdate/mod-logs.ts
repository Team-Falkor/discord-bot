import {
  EmbedBuilder,
  PartialMessage,
  TextChannel,
  type Message,
} from "discord.js";
import { Handler } from "../../handler";
import { ClientClass } from "../../structure/Client";

export default function (
  oldMessage: Message<boolean> | PartialMessage,
  newMessage: Message<boolean> | PartialMessage,
  client: ClientClass,
  handler: Handler
) {
  try {
    if (!oldMessage.guild || !newMessage.guild) return;

    if (oldMessage.author?.bot) return;

    const modLogs = client.modLogs.get(oldMessage.guild.id);
    if (!modLogs) return;
    if (!modLogs.settings?.editedMessage) return;

    const embed = new EmbedBuilder()
      .setColor("Yellow")
      .setTitle("Message Edited")
      .setAuthor({
        name: oldMessage?.author?.tag!,
        iconURL: oldMessage.author!.displayAvatarURL()!,
      })
      .addFields(
        {
          name: "old message",
          value:
            oldMessage.cleanContent!?.length < 1
              ? "Unknown"
              : oldMessage.cleanContent!,
        },
        {
          name: "new message",
          value:
            newMessage.cleanContent!?.length < 1
              ? "Unknown"
              : newMessage.cleanContent!,
        },
        {
          name: "Channel",
          value: oldMessage.channel.toString(),
          inline: true,
        },
        {
          name: "Author",
          value: oldMessage.author!.toString(),
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
