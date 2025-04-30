import {
  ActionRowBuilder,
  ApplicationCommandOptionType,
  ButtonBuilder,
  ButtonStyle,
  DMChannel,
  EmbedBuilder,
  NewsChannel,
  TextChannel,
} from "discord.js";
import { CommandData, CommandOptions, SlashCommandProps } from "../../handler";

export const data: CommandData = {
  name: "poll",
  description: "creates a poll",
  options: [
    {
      name: "topic",
      description: "topic of the poll",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],
};

export async function run({ interaction, client }: SlashCommandProps) {
  // Make sure we have a channel that can send messages
  const channel = interaction.channel;
  if (
    !channel ||
    !(
      channel instanceof TextChannel ||
      channel instanceof DMChannel ||
      channel instanceof NewsChannel
    )
  ) {
    console.error("Unsupported or missing channel on poll interaction.");
    return;
  }

  // Acknowledge immediately
  await interaction.reply({ content: "Creating a poll…", ephemeral: true });

  const topic = interaction.options.getString("topic", true);

  const embed = new EmbedBuilder()
    .setColor(client.config.color)
    .setTitle("📌 Poll started")
    .setDescription(`> ${topic}`)
    .addFields([
      { name: "✅ Yes", value: "0", inline: true },
      { name: "❌ No", value: "0", inline: true },
    ])
    .setFooter({
      text: `Started by ${interaction.user.username}`,
      iconURL: interaction.user.displayAvatarURL(),
    })
    .setTimestamp();

  const buttons = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId("upvotePoll")
      .setLabel("✅ YES")
      .setStyle(ButtonStyle.Success),
    new ButtonBuilder()
      .setCustomId("downvotePoll")
      .setLabel("❌ NO")
      .setStyle(ButtonStyle.Danger)
  );

  // Send the poll embed + buttons
  const msg = await channel.send({ embeds: [embed], components: [buttons] });

  // Collector that runs for up to 24h
  msg.createMessageComponentCollector({ time: 24 * 60 * 60 * 1000 });

  // Persist poll in your database
  const db = client.pollVotes;
  await db.create({
    data: {
      guildId: interaction.guild!.id,
      ownerId: interaction.user.id,
      messageId: msg.id,
      upMembers: [],
      downMembers: [],
      upvotes: 0,
      downvotes: 0,
    },
  });
}

export const options: CommandOptions = {
  devOnly: false,
  deleted: false,
  userPermissions: ["Administrator"],
};
