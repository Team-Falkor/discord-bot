import { CommandData, CommandOptions, SlashCommandProps } from "../../handler";

import { EmbedBuilder } from "discord.js";

export const data: CommandData = {
  name: "config_create",
  description: "creates a config for your guild",
};

export async function run({ interaction, client, handler }: SlashCommandProps) {
  const db = client.db.guild_config;

  if (!interaction.guild) {
    return await interaction.reply({
      content: "This command can only be used in a server",
      ephemeral: true,
    });
  }

  const hasConfig = await db.findUnique({
    where: {
      guild_id: interaction.guild.id,
    },
  });

  const embed = new EmbedBuilder()
    .setColor("Red")
    .setTitle("Config")
    .setDescription("There is already a config for this server")
    .setTimestamp();

  if (hasConfig)
    return await interaction.reply({ embeds: [embed], ephemeral: true });

  await db.create({
    data: {
      guild_id: interaction.guild.id,
    },
  });

  embed
    .setColor("Green")
    .setTitle("Config")
    .setDescription(`Config created for server ${interaction.guild.name}`)
    .setTimestamp();

  console.info(
    "Guild Config Created",
    interaction.guild.name,
    interaction.guild.id
  );

  return await interaction.reply({ embeds: [embed], ephemeral: true });
}

export const options: CommandOptions = {
  devOnly: false,
  deleted: false,
  userPermissions: ["Administrator"],
};
