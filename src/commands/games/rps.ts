type RPS = "Rock" | "Paper" | "Scissors";
type RPSEmoji = "🪨" | "📄" | "✂️";

type Choiches = {
  name: RPS;
  emoji: RPSEmoji;
  beats: RPS;
};

const choices: Choiches[] = [
  { name: "Rock", emoji: "🪨", beats: "Scissors" },
  { name: "Paper", emoji: "📄", beats: "Rock" },
  { name: "Scissors", emoji: "✂️", beats: "Paper" },
];

import { CommandData, CommandOptions, SlashCommandProps } from "../../handler";

import {
  ActionRowBuilder,
  ApplicationCommandOptionType,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
} from "discord.js";

export const data: CommandData = {
  name: "rps",
  description: "Play Rock, Paper, Scissors with someone!",
  options: [
    {
      name: "user",
      description: "the user to challenge",
      type: ApplicationCommandOptionType.User,
      required: true,
    },
  ],
};

export async function run({ interaction, client, handler }: SlashCommandProps) {
  try {
    const user = interaction.options.getUser("user") || interaction.user;

    if (interaction.user.id === user.id)
      return interaction.reply({
        content: "You can't play against yourself",
        ephemeral: true,
      });

    if (user.bot) {
      return interaction.reply({
        content: "You can't play against a bot",
        ephemeral: true,
      });
    }

    const embed = new EmbedBuilder()
      .setTitle("Rock Paper Scissors")
      .setDescription(`It's currently ${user}'s turn`)
      .setColor("Yellow")
      .setTimestamp();

    const buttons = choices.map((choice) => {
      return new ButtonBuilder()
        .setCustomId(choice.name)
        .setLabel(choice.name)
        .setEmoji(choice.emoji)
        .setStyle(ButtonStyle.Primary);
    });

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(buttons);

    const reply = await interaction.reply({
      content: `${user}, you have been challenged to a game of Rock, Paper, Scissors, by ${interaction.user}, To start click one of the buttons bellow`,
      embeds: [embed],
      components: [row],
    });

    const userInteraction = await reply
      .awaitMessageComponent({
        filter: (i) => i.user.id === user.id,
        time: 30_000,
      })
      .catch(async (error) => {
        embed.setDescription(`Game over. ${user} did not respond in time.`);
        await reply.edit({
          embeds: [embed],
          components: [],
        });
      });

    if (!userInteraction) return;

    const userChoice = choices.find(
      (choice) => choice.name === userInteraction.customId
    );

    await userInteraction.reply({
      content: `you have chosen ${userChoice!.emoji + userChoice!.name}`,
      ephemeral: true,
    });

    // Edit embed with updated users turn
    embed.setDescription(`It's currently ${interaction.user} turn`);
    await reply.edit({
      content: `${user}, you have been challenged to a game of Rock, Paper, Scissors, by ${interaction.user}`,
      embeds: [embed],
    });

    const initialUserInteraction = await reply
      .awaitMessageComponent({
        filter: (i) => i.user.id === interaction.user.id,
        time: 30_000,
      })
      .catch(async (error) => {
        embed.setDescription(
          `Game over. ${interaction.user} did not respond in time.`
        );
        await reply.edit({
          embeds: [embed],
          components: [],
        });
      });

    if (!initialUserInteraction) return;

    const initialUserChoice = choices.find(
      (choice) => choice.name === initialUserInteraction.customId
    );

    await initialUserInteraction.reply({
      content: `you have chosen ${
        initialUserChoice!.emoji + initialUserChoice!.name
      }`,
      ephemeral: true,
    });

    let result;

    if (userChoice!.beats === initialUserChoice!.name) {
      result = `${userChoice!.emoji} beats ${
        initialUserChoice!.emoji
      }. ${user} wins!`;
    }

    if (initialUserChoice?.beats === userChoice!.name) {
      result = `${initialUserChoice!.emoji} beats ${userChoice!.emoji}. ${
        interaction.user
      } wins!`;
    }

    if (userChoice!.name === initialUserChoice!.name)
      result = `No one wins. It's a draw`;

    embed.setDescription(
      `${user} picked ${userChoice!.emoji + userChoice!.name}\n ${
        interaction.user
      } picked ${
        initialUserChoice!.emoji + initialUserChoice!.name
      }\n\n ${result}`
    );

    reply.edit({
      embeds: [embed],
      components: [],
    });
  } catch (error) {
    console.error(`[/rps] error`);
    console.error(error);
  }
}

export const options: CommandOptions = {
  devOnly: false,
  deleted: false,
};
