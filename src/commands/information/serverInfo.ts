import { EmbedBuilder } from "discord.js";
import { CommandData, CommandOptions, SlashCommandProps } from "../../handler";

import dayjs from "dayjs";

export const data: CommandData = {
  name: "serverinfo",
  description: "Get information about the server.",
};

export async function run({ interaction, client, handler }: SlashCommandProps) {
  const server = interaction.guild;

  const servercreated = server?.createdAt
    ? dayjs(server?.createdAt).format("DD/MM/YYYY HH:mm:ss")
    : "Unknown";

  const serverOwner = server?.ownerId
    ? await server?.members?.fetch(server?.ownerId)
    : null;

  const embed = new EmbedBuilder()
    .setTitle(`${server?.name} Server Information`)
    .addFields(
      {
        name: "created at",
        value: servercreated,
        inline: true,
      },
      {
        name: "Owner",
        value: serverOwner ? serverOwner.user.username : "Unknown",
        inline: true,
      },
      {
        name: "Members",
        value: server?.memberCount?.toString() ?? "Unknown",
        inline: true,
      },
      {
        name: "Channels",
        value: server?.channels?.cache.size?.toString() ?? "Unknown",
        inline: true,
      },
      {
        name: "Roles",
        value: server?.roles?.cache.size?.toString() ?? "Unknown",
        inline: true,
      },
      {
        name: "Emojis",
        value: server?.emojis?.cache.size?.toString() ?? "Unknown",
        inline: true,
      }
    )
    .setFooter({
      text: `Requested by ${interaction.user.tag}`,
      iconURL: interaction.user.displayAvatarURL(),
    });

  if (server?.iconURL()) {
    embed.setThumbnail(server?.iconURL());
  }

  await interaction.reply({ embeds: [embed] });
}

export const options: CommandOptions = {
  devOnly: false,
  deleted: false,
};
