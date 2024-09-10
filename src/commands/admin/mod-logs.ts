import { ApplicationCommandOptionType } from "discord.js";
import { CommandData, CommandOptions, SlashCommandProps } from "../../handler";

export const data: CommandData = {
  name: "modlogs",
  description: "Setup mod logs.",
  options: [
    {
      name: "channel",
      description: "The channel to send mod logs to.",
      type: ApplicationCommandOptionType.Channel,
      required: true,
    },
  ],
};

export async function run({ interaction, client }: SlashCommandProps) {
  const db = client.db;
  const guildId = interaction.guild?.id;
  const channel = interaction.options.getChannel("channel", true);

  // Early return if guildId is missing (defensive check)
  if (!guildId) {
    return interaction.reply({
      content: "Guild not found.",
      ephemeral: true,
    });
  }

  // Check if the channel is already set for mod logs
  const existingLog = await db.moderationChannel.findFirst({
    where: { guild_id: guildId },
  });

  if (existingLog?.channel_id === channel.id) {
    return interaction.reply({
      content: "This channel is already set as the mod logs channel.",
      ephemeral: true,
    });
  }

  // Upsert the mod logs channel and settings
  const modLogData = await db.moderationChannel.upsert({
    where: { guild_id: guildId },
    create: {
      guild_id: guildId,
      channel_id: channel.id,
      settings: { create: {} },
    },
    update: { channel_id: channel.id },
    select: {
      channel_id: true,
      settings: true,
    },
  });

  // Update the client modLogs cache
  client.modLogs.set(guildId, {
    channelId: modLogData.channel_id,
    settings: modLogData.settings,
  });

  // Send success reply
  return interaction.reply({
    content: "Successfully set mod logs channel.",
    ephemeral: true,
  });
}

export const options: CommandOptions = {
  devOnly: false,
  deleted: false,
  userPermissions: ["Administrator"],
};
