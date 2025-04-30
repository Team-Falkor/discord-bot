import { EmbedBuilder } from "discord.js";
import { CommandData, CommandOptions, SlashCommandProps } from "../../handler";

export const data: CommandData = {
  name: "cleaderboard",
  description: "check the leaderboard for the counting system",
};

export async function run({ interaction, client, handler }: SlashCommandProps) {
  try {
    const db = client.db.user;

    const data = await db.findMany({
      where: {
        guild_config: {
          guild_id: interaction.guildId!,
        },
      },
      orderBy: {
        counting_score: "desc",
      },
      take: 10,
    });

    const embed = new EmbedBuilder()
      .setColor(client.config.color)
      .setTitle("Counting Leaderboard")
      .setFooter({ text: `Requested by ${interaction.user.tag}` })
      .setTimestamp();

    if (data.length === 0) {
      embed.setDescription("No one has counted yet");
    } else {
      // Fetch all users, fallback to API if not cached
      for (let i = 0; i < data.length; i++) {
        const userData = data[i];
        let username = "Unknown User";
        let userTag = "";
        let userObj = client.users.cache.get(userData.user_id);
        if (!userObj) {
          try {
            userObj = await client.users.fetch(userData.user_id);
          } catch (e) {
            // Ignore fetch error, keep username as Unknown User
          }
        }
        if (userObj) {
          username = userObj.username;
          userTag = userObj.tag;
        }
        embed.addFields({
          name: `${i + 1}. ${username}`,
          value: `Score: ${userData.counting_score}${
            userTag ? `\nTag: ${userTag}` : ""
          }`,
          inline: false,
        });
      }
    }

    await interaction.reply({ embeds: [embed] });
  } catch (error) {
    console.error(error);
    const errEmbed = new EmbedBuilder()
      .setColor("Red")
      .setDescription(
        "⛔ Something went wrong while fetching the leaderboard. Please try again later."
      )
      .setTimestamp();
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({ embeds: [errEmbed], ephemeral: true });
    } else {
      await interaction.reply({ embeds: [errEmbed], ephemeral: true });
    }
  }
}

export const options: CommandOptions = {
  devOnly: false,
  deleted: false,
};
