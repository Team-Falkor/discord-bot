import { CommandData, CommandOptions, SlashCommandProps } from "../../handler";

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

export async function run({ interaction, client, handler }: SlashCommandProps) {
  // Ensure the interaction has a valid channel before proceeding
  if (!interaction.channel) {
    console.error("Interaction has no channel.");
    return;
  }

  // Ensure the channel is of a type that supports sending messages
  if (
    !(
      interaction.channel instanceof TextChannel ||
      interaction.channel instanceof DMChannel ||
      interaction.channel instanceof NewsChannel
    )
  ) {
    console.error("Unsupported channel type for sending poll message.");
    return;
  }

  // Send initial reply
  await interaction.reply({
    content: "Creating a poll",
    ephemeral: true,
  });

  const topic = interaction.options.getString("topic", true);

  const embed = new EmbedBuilder()
    .setColor(client.config.color)
    .setTitle("📌 Poll started")
    .setDescription(`> ${topic}`)
    .addFields({ name: "✅ Yes", value: "0", inline: true })
    .addFields({ name: "❌ No", value: "0", inline: true })
    .setFooter({
      text: `Started by ${interaction.user.username}`,
      iconURL: interaction.user.displayAvatarURL(),
    });

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

  // At this point, we know `interaction.channel` is valid and supports `send()`
  const msg = await interaction.channel.send({
    embeds: [embed],
    components: [buttons],
  });

  // Create a message component collector for the poll
  msg.createMessageComponentCollector();

  // Store poll data in the database
  await client.db.poll_votes.create({
    data: {
      guild_id: interaction.guild!.id,
      owner_id: interaction.user.id,
      message_id: msg.id,
      down_members: [],
      up_members: [],
      downvotes: 0,
      upvotes: 0,
    },
  });
}

export const options: CommandOptions = {
  devOnly: false,
  deleted: false,
  userPermissions: ["Administrator"],
};
