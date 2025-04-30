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

    if (!guildId) {
      return interaction.editReply({
        content: "❌ This command must be used in a server.",
      });
    }
    if (user.id === interaction.user.id) {
      return interaction.editReply({ content: "❌ You cannot warn yourself." });
    }
    if (interaction.guild.ownerId === user.id) {
      return interaction.editReply({
        content: "❌ You cannot warn the server owner.",
      });
    }

    // 1️⃣ Find existing user warning record
    const existingUser = await client.db.user.findFirst({
      where: { discordId: user.id, guildId },
    });

    const newWarningCount = (existingUser?.warnings ?? 0) + 1;

    // 2️⃣ Update or create the user record
    if (existingUser) {
      await client.db.user.update({
        where: { id: existingUser.id },
        data: { warnings: newWarningCount },
      });
    } else {
      await client.db.user.create({
        data: {
          discordId: user.id,
          guildId,
          warnings: newWarningCount,
          countingScore: 0,
        },
      });
    }

    // 3️⃣ Build the embed
    const isBan = newWarningCount >= MAX_WARNINGS;
    const embed = new EmbedBuilder()
      .setTitle(isBan ? "❌ User Banned" : "⚠️ User Warned")
      .setColor(isBan ? "Red" : "Yellow")
      .setDescription(
        `**User:** ${user}\n` +
          `**Moderator:** ${moderator}\n` +
          `**Reason:** ${reason}\n` +
          `**Total Warnings:** ${newWarningCount}/${MAX_WARNINGS}`
      )
      .setFooter({
        text: `${isBan ? "Banned" : "Warned"} at ${dayjs().format(
          "YYYY-MM-DD HH:mm:ss"
        )}`,
      })
      .setTimestamp();

    // 4️⃣ Auto-ban if needed
    if (isBan) {
      try {
        await interaction.guild.members.ban(user, {
          reason: `Reached ${MAX_WARNINGS} warnings.`,
        });
      } catch (banError) {
        console.error("Error banning user:", banError);
        embed
          .setTitle("⚠️ Failed to Ban User")
          .setColor("Orange")
          .setDescription(
            `**User:** ${user}\n` +
              `**Moderator:** ${moderator}\n` +
              `**Reason:** Could not ban (missing permissions).`
          );
      }
    }

    // 5️⃣ Send the result to the mod-log channel if enabled
    const guildSettings = client.modLogs.get(guildId);
    const shouldLog = guildSettings?.settings.userTimeout;
    const logChannel = shouldLog
      ? (interaction.guild.channels.cache.get(guildSettings.channelId) as
          | TextChannel
          | undefined)
      : undefined;

    await interaction.editReply({ embeds: [embed] });

    if (logChannel?.isTextBased()) {
      await logChannel.send({ embeds: [embed] });
    }
  } catch (error) {
    console.error("Error executing warn command:", error);
    const errMsg = "❌ An error occurred while executing this command.";
    if (interaction.deferred || interaction.replied) {
      await interaction.editReply({ content: errMsg });
    } else {
      await interaction.reply({
        content: errMsg,
        flags: MessageFlags.Ephemeral,
      });
    }
  }
}

export const options: CommandOptions = {
  devOnly: false,
  botPermissions: ["ManageMessages", "BanMembers"],
  userPermissions: ["ManageMessages", "ModerateMembers"],
  deleted: false,
};
