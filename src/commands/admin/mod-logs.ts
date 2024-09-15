import { ApplicationCommandOptionType } from "discord.js";
import { CommandData, CommandOptions, SlashCommandProps } from "../../handler";

export const data: CommandData = {
  name: "modlogs",
  description: "Setup mod logs.",
  options: [
    {
      name: "setup",
      description: "setup mod logs",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "channel",
          description: "The channel to send mod logs to.",
          type: ApplicationCommandOptionType.Channel,
          required: true,
        },
      ],
    },
    {
      name: "settings",
      description: "mod logs settings",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "channel",
          description: "The channel to send mod logs to.",
          type: ApplicationCommandOptionType.Channel,
          required: false,
        },
        {
          name: "deleted_messages",
          description: "Enable/Disable User Join",
          type: ApplicationCommandOptionType.Boolean,
          required: false,
        },
        {
          name: "edited_messages",
          description: "Enable/Disable Edited Messages",
          type: ApplicationCommandOptionType.Boolean,
          required: false,
        },
        {
          name: "user_leave",
          description: "Enable/Disable User Leave",
          type: ApplicationCommandOptionType.Boolean,
          required: false,
        },
        {
          name: "user_join",
          description: "Enable/Disable User Join",
          type: ApplicationCommandOptionType.Boolean,
          required: false,
        },
        {
          name: "user_ban",
          description: "Enable/Disable User Ban",
          type: ApplicationCommandOptionType.Boolean,
          required: false,
        },
      ],
    },
  ],
};

export async function run({ interaction, client }: SlashCommandProps) {
  const db = client.db;
  const guildId = interaction.guild?.id;
  const subcommand = interaction.options.getSubcommand();

  // Early return if guildId is missing (defensive check)
  if (!guildId) {
    return interaction.reply({
      content: "Guild not found.",
      ephemeral: true,
    });
  }

  switch (subcommand) {
    case "settings":
      const deletedMessages =
        interaction.options.getBoolean("deleted_messages") ?? undefined;
      const editedMessages =
        interaction.options.getBoolean("edited_messages") ?? undefined;
      const userLeave =
        interaction.options.getBoolean("user_leave") ?? undefined;
      const userJoin = interaction.options.getBoolean("user_join") ?? undefined;
      const userBan = interaction.options.getBoolean("user_ban") ?? undefined;
      const settingsChannel = interaction.options.getChannel("channel", false);

      const modChannel = await db.moderationChannel.findFirst({
        where: { guild_id: guildId },
        select: { id: true, settings: true, channel_id: true, guild_id: true },
      });

      if (!modChannel) {
        if (!settingsChannel) {
          return interaction.reply({
            content:
              "No mod logs channel set. therefore the channel option is required",
            ephemeral: true,
          });
        }

        return interaction.reply({
          content: "No mod logs channel set.",
          ephemeral: true,
        });
      }

      // Upsert the mod logs settings
      const modLogSettings = await db.moderationChannelSettings.upsert({
        where: {
          id: modChannel.settings.id,
        },
        create: {
          deleted_message: deletedMessages,
          edited_message: editedMessages,
          user_join: userJoin,
          user_left: userLeave,
          user_ban: userBan,
          ModerationChannel: {
            create: {
              channel_id: modChannel.channel_id,
              guild_id: modChannel.guild_id,
            },
          },
        },
        update: {
          deleted_message: deletedMessages,
          edited_message: editedMessages,
          user_join: userJoin,
          user_left: userLeave,
          user_ban: userBan,
        },
      });

      // Update the client modLogs cache
      client.modLogs.set(guildId, {
        channelId: modChannel.channel_id,
        settings: modLogSettings,
      });

      // Send success reply
      return await interaction.reply({
        content: "Successfully updated mod logs settings.",
        ephemeral: true,
      });
    case "setup":
      const channel = interaction.options.getChannel("channel", true);

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
    default:
      break;
  }
}

export const options: CommandOptions = {
  devOnly: false,
  deleted: false,

  userPermissions: ["Administrator"],
};
