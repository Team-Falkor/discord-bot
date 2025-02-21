import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import relativeTime from "dayjs/plugin/relativeTime";
import {
  ApplicationCommandOptionType,
  EmbedBuilder,
  GuildMember,
  MessageFlags,
  TextChannel,
} from "discord.js";
import {
  CommandData,
  CommandOptions,
  SlashCommandProps,
} from "../../handler/@types";

dayjs.extend(duration);
dayjs.extend(relativeTime);

const MAX_WARNINGS = 5;

export const data: CommandData = {
  name: "warn",
  description: "Warn a user, log the warning, and save it in the database.",
  options: [
    {
      name: "user",
      description: "The user to warn.",
      type: ApplicationCommandOptionType.User,
      required: true,
    },
    {
      name: "reason",
      description: "The reason for the warning.",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],
};

export async function run({ interaction, client }: SlashCommandProps) {
  try {
    await interaction.deferReply({ flags: MessageFlags.Ephemeral });

    const user = interaction.options.getUser("user", true);
    const reason = interaction.options.getString("reason", true);
    const moderator = interaction.member as GuildMember;
    const guildId = interaction.guild?.id;

    if (!guildId)
      return interaction.editReply({
        content: "❌ This command must be used in a server.",
      });
    if (user.id === interaction.user.id)
      return interaction.editReply({ content: "❌ You cannot warn yourself." });
    if (interaction.guild?.ownerId === user.id)
      return interaction.editReply({
        content: "❌ You cannot warn the server owner.",
      });

    // Fetch or create user warning data
    const existingUser = await client.db.user.findFirst({
      where: { user_id: user.id, guild_config: { guild_id: guildId } },
    });

    const updatedWarnings = existingUser ? existingUser.warnings + 1 : 1;

    await client.db.user.upsert({
      where: { id: existingUser?.id || "" },
      update: { warnings: updatedWarnings },
      create: {
        user_id: user.id,
        warnings: updatedWarnings,
        guild_config: {
          connectOrCreate: {
            where: { guild_id: guildId },
            create: { guild_id: guildId },
          },
        },
      },
    });

    const embed = new EmbedBuilder()
      .setTitle(
        updatedWarnings >= MAX_WARNINGS ? "❌ User Banned" : "⚠️ User Warned"
      )
      .setColor(updatedWarnings >= MAX_WARNINGS ? "Red" : "Yellow")
      .setDescription(
        `**User:** ${user}\n**Moderator:** ${moderator}\n**Reason:** ${reason}\n**Total Warnings:** ${updatedWarnings}/${MAX_WARNINGS}`
      )
      .setFooter({
        text: `${
          updatedWarnings >= MAX_WARNINGS ? "Banned" : "Warned"
        } at ${dayjs().format("YYYY-MM-DD HH:mm:ss")}`,
      });

    // Auto-ban if warnings exceed max limit
    if (updatedWarnings >= MAX_WARNINGS) {
      try {
        await interaction.guild?.members.ban(user, {
          reason: `Reached ${MAX_WARNINGS} warnings.`,
        });
      } catch (banError) {
        console.error("Error banning user:", banError);
        embed
          .setTitle("⚠️ Failed to Ban User")
          .setColor("Orange")
          .setDescription(
            `**User:** ${user}\n**Moderator:** ${moderator}\n**Reason:** Could not ban due to missing permissions.`
          );
      }
    }

    await interaction.editReply({ embeds: [embed] });

    // Log the action using client.modLogs
    const guildSettings = client.modLogs.get(guildId);
    const logChannel = guildSettings?.settings.user_timeout
      ? (interaction.guild?.channels.cache.get(
          guildSettings.channelId
        ) as TextChannel)
      : null;

    if (logChannel?.isTextBased()) {
      await logChannel.send({ embeds: [embed] });
    }
  } catch (error) {
    console.error("Error executing warn command:", error);
    const errorMessage = "❌ An error occurred while executing this command.";

    interaction.replied || interaction.deferred
      ? interaction.editReply({ content: errorMessage })
      : interaction.reply({
          content: errorMessage,
          flags: MessageFlags.Ephemeral,
        });
  }
}

export const options: CommandOptions = {
  devOnly: false,
  botPermissions: ["ManageMessages", "BanMembers"],
  userPermissions: ["ManageMessages", "ModerateMembers"],
  deleted: false,
};
