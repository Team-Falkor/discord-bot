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
      .setTitle("Counting leaderboard")
      .setFooter({ text: `Requested by ${interaction.user.tag}` })
      .setTimestamp();

    if (data.length === 0) {
      embed.setDescription("No one has counted yet");
    } else {
      data.forEach((user, index) => {
        const find_user = client.users.cache.get(user.user_id);

        embed.addFields({
          name: `${index + 1}. ${find_user?.username}`,
          value: `Score: ${user.counting_score}`,
        });
      });
    }

    return await interaction.reply({ embeds: [embed] });
  } catch (error) {
    console.error(error);
  }
}

export const options: CommandOptions = {
  devOnly: false,
  deleted: false,
};
