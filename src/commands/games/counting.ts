import {
  ApplicationCommandOptionType,
  ChannelType,
  ChatInputCommandInteraction,
  EmbedBuilder,
  TextChannel,
} from "discord.js";
import { CommandData, CommandOptions, SlashCommandProps } from "../../handler";

export const data: CommandData = {
  name: "counting",
  description: "Configure the counting system",
  options: [
    {
      name: "setup",
      description: "The channel to use for the counting game",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "channel",
          description: "The channel to send counting messages in",
          type: ApplicationCommandOptionType.Channel,
          channel_types: [ChannelType.GuildText],
          required: true,
        },
      ],
    },
    {
      name: "mute",
      description: "Mute a user from the counting game",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "user",
          description: "The user to mute",
          type: ApplicationCommandOptionType.User,
          required: true,
        },
      ],
    },
    {
      name: "unmute",
      description: "Unmute a user from the counting game",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "user",
          description: "The user to unmute",
          type: ApplicationCommandOptionType.User,
          required: true,
        },
      ],
    },
  ],
};

export async function run({ interaction, client }: SlashCommandProps) {
  // strongly-typed accessors
  const { options, guildId, guild, member } =
    interaction as ChatInputCommandInteraction<"cached">;
  const sub = options.getSubcommand();

  if (!guildId || !guild) {
    return interaction.reply({
      content: "This command must be run in a server.",
      ephemeral: true,
    });
  }

  // Prisma model
  const db = client.countingGame;

  // Pre-fetch existing config (guildId is not unique, so use findFirst)
  const existing = await db.findFirst({ where: { guildId } });

  // Handle setup
  if (sub === "setup") {
    const targetChannel = options.getChannel("channel", true) as TextChannel;
    if (!targetChannel.isTextBased()) {
      return interaction.reply({
        content: "⛔ Please provide a valid text channel.",
        ephemeral: true,
      });
    }

    if (!existing) {
      await db.create({
        data: {
          guildId,
          channelId: targetChannel.id,
        },
      });
    } else {
      await db.updateMany({
        where: { guildId },
        data: { channelId: targetChannel.id },
      });
    }

    return interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor("Green")
          .setDescription(
            `✅ Counting system configured in ${targetChannel.toString()}`
          )
          .setTimestamp(),
      ],
      ephemeral: true,
    });
  }

  // For mute/unmute we need a config
  if (!existing) {
    return interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor("Red")
          .setDescription(
            "⛔ The counting system is not set up in this server."
          )
          .setTimestamp(),
      ],
      ephemeral: true,
    });
  }

  const targetUser = options.getUser("user", true);

  // Fetch the configured channel
  const countingChannel = (await guild.channels.fetch(
    existing.channelId
  )) as TextChannel | null;
  if (!countingChannel || !countingChannel.isTextBased()) {
    return interaction.reply({
      content: "⛔ Could not find the configured counting channel.",
      ephemeral: true,
    });
  }

  const isMute = sub === "mute";
  // Use the correct camelCase permission
  await countingChannel.permissionOverwrites.edit(targetUser.id, {
    SendMessages: !isMute,
  });

  return interaction.reply({
    embeds: [
      new EmbedBuilder()
        .setColor("Green")
        .setDescription(
          isMute
            ? `✅ Muted ${targetUser.toString()} from the counting game`
            : `✅ Unmuted ${targetUser.toString()} for the counting game`
        )
        .setFooter({
          text: `${isMute ? "Muted" : "Unmuted"} by ${member!.user.username}`,
          iconURL: interaction.user.displayAvatarURL(),
        })
        .setTimestamp(),
    ],
    ephemeral: true,
  });
}

export const options: CommandOptions = {
  devOnly: false,
  deleted: false,
  userPermissions: ["Administrator"],
};
