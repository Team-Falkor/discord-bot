import { ApplicationCommandOptionType } from "discord.js";
import { CommandData, CommandOptions, SlashCommandProps } from "../../handler";

export const data: CommandData = {
  name: "modlogs",
  description: "Setup and configure moderation logs",
  options: [
    {
      name: "setup",
      description: "Set the channel for moderation logs",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "channel",
          description: "The channel to send mod logs to",
          type: ApplicationCommandOptionType.Channel,
          required: true,
        },
      ],
    },
    {
      name: "settings",
      description: "Enable or disable specific mod-log events",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "channel",
          description: "Optionally change the mod-logs channel",
          type: ApplicationCommandOptionType.Channel,
          required: false,
        },
        {
          name: "deleted_messages",
          description: "Log deleted messages",
          type: ApplicationCommandOptionType.Boolean,
          required: false,
        },
        {
          name: "edited_messages",
          description: "Log edited messages",
          type: ApplicationCommandOptionType.Boolean,
          required: false,
        },
        {
          name: "user_leave",
          description: "Log when users leave",
          type: ApplicationCommandOptionType.Boolean,
          required: false,
        },
        {
          name: "user_join",
          description: "Log when users join",
          type: ApplicationCommandOptionType.Boolean,
          required: false,
        },
        {
          name: "user_ban",
          description: "Log when users are banned",
          type: ApplicationCommandOptionType.Boolean,
          required: false,
        },
      ],
    },
  ],
};

export async function run({ interaction, client }: SlashCommandProps) {
  const guildId = interaction.guild?.id;
  if (!guildId) {
    return interaction.reply({
      content: "This command must be used in a server.",
      ephemeral: true,
    });
  }

  const { moderationChannel, moderationChannelSettings } = client.db;
  const sub = interaction.options.getSubcommand();

  if (sub === "setup") {
    const channel = interaction.options.getChannel("channel", true);
    const existing = await moderationChannel.findUnique({ where: { guildId } });

    if (existing) {
      await moderationChannel.update({
        where: { guildId },
        data: { channelId: channel.id },
      });

      client.modLogs.get(guildId)!.channelId = channel.id;

      return interaction.reply({
        content: `Mod-logs channel updated to ${channel}.`,
        ephemeral: true,
      });
    }

    const settings = await moderationChannelSettings.create({
      data: { moderationChannelId: -1 },
    });

    const modChannel = await moderationChannel.create({
      data: {
        guildId,
        channelId: channel.id,
        moderationChannelSettingsId: settings.id,
      },
      include: { settings: true },
    });

    await moderationChannelSettings.update({
      where: { id: settings.id },
      data: { moderationChannelId: modChannel.id },
    });

    client.modLogs.set(guildId, {
      channelId: modChannel.channelId,
      settings: modChannel.settings,
    });

    return interaction.reply({
      content: `Mod-logs channel set to ${channel}.`,
      ephemeral: true,
    });
  }

  // — settings subcommand —
  const newChannel = interaction.options.getChannel("channel", false);
  const updates: Record<string, boolean | undefined> = {
    deletedMessage:
      interaction.options.getBoolean("deleted_messages") ?? undefined,
    editedMessage:
      interaction.options.getBoolean("edited_messages") ?? undefined,
    userLeft: interaction.options.getBoolean("user_leave") ?? undefined,
    userJoin: interaction.options.getBoolean("user_join") ?? undefined,
    userBan: interaction.options.getBoolean("user_ban") ?? undefined,
  };

  const existing = await moderationChannel.findUnique({
    where: { guildId },
    include: { settings: true },
  });

  if (!existing) {
    return interaction.reply({
      content: "No mod-logs channel configured. Use `/modlogs setup` first.",
      ephemeral: true,
    });
  }

  if (newChannel) {
    await moderationChannel.update({
      where: { guildId },
      data: { channelId: newChannel.id },
    });

    existing.channelId = newChannel.id;
  }

  const filteredUpdates = Object.fromEntries(
    Object.entries(updates).filter(([, value]) => value !== null)
  );

  const newSettings =
    Object.keys(filteredUpdates).length > 0
      ? await moderationChannelSettings.update({
          where: { id: existing.settings.id },
          data: filteredUpdates,
        })
      : existing.settings;

  client.modLogs.set(guildId, {
    channelId: existing.channelId,
    settings: newSettings,
  });

  return interaction.reply({
    content: "Mod-logs settings updated successfully.",
    ephemeral: true,
  });
}

export const options: CommandOptions = {
  devOnly: false,
  deleted: false,
  userPermissions: ["Administrator"],
};
