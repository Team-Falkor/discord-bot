import { EmbedBuilder } from "discord.js";
import { CommandData, CommandOptions, SlashCommandProps } from "../../handler";

export const data: CommandData = {
  name: "config_create",
  description: "Creates a config for your guild",
};

export async function run({ interaction, client }: SlashCommandProps) {
  const db = client.db;

  if (!interaction.guild) {
    return await interaction.reply({
      content: "This command can only be used in a server.",
      ephemeral: true,
    });
  }

  const guildId = interaction.guild.id;
  const guildName = interaction.guild.name;

  // Ensure Guild exists (create it if it doesn't)
  await db.guild.upsert({
    where: { id: guildId },
    update: {},
    create: { id: guildId, name: guildName },
  });

  const existingConfig = await db.guildConfig.findUnique({
    where: {
      guildId: guildId,
    },
  });

  const embed = new EmbedBuilder().setTitle("Guild Config").setTimestamp();

  if (existingConfig) {
    embed
      .setColor("Red")
      .setDescription("There is already a config for this server.");
    return await interaction.reply({ embeds: [embed], ephemeral: true });
  }

  await db.guildConfig.create({
    data: {
      guildId: guildId,
    },
  });

  embed
    .setColor("Green")
    .setDescription(`Config created for server **${guildName}**.`);

  console.info("Guild Config Created:", guildName, guildId);

  return await interaction.reply({ embeds: [embed], ephemeral: true });
}

export const options: CommandOptions = {
  devOnly: false,
  deleted: false,
  userPermissions: ["Administrator"],
};
