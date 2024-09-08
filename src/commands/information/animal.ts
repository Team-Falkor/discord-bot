import { ApplicationCommandOptionType, EmbedBuilder } from "discord.js";
import {
  CommandData,
  AutocompleteProps,
  SlashCommandProps,
  CommandOptions,
} from "../../handler";

export const data: CommandData = {
  name: "animal",
  description:
    "Get a random picture and fact about an animal, and a short fact!",
  options: [
    {
      name: "animal_name",
      description: "name of the animal",
      type: ApplicationCommandOptionType.String,
      required: true,
      autocomplete: true,
    },
  ],
};

export function autocomplete({
  interaction,
  client,
  handler,
}: AutocompleteProps) {
  const focusedValue = interaction.options.getFocused()?.toLowerCase();

  const choices = [
    "Dog",
    "Cat",
    "Koala",
    "Panda",
    "Red panda",
    "Bird",
    "Raccoon",
    "Kangaroo",
  ];

  if (!focusedValue)
    return interaction.respond(
      choices.map((choice) => ({ name: choice, value: choice }))
    );

  const filtered = choices.filter((choice) =>
    choice?.toLowerCase().includes(focusedValue)
  );

  interaction.respond(
    filtered.map((choice) => ({ name: choice, value: choice })).slice(0, 25)
  );
}

export async function run({ interaction, client, handler }: SlashCommandProps) {
  const animal_name = interaction.options
    .getString("animal_name")
    ?.replaceAll(" ", "_");

  const data = await (
    await fetch(`https://some-random-api.com/animal/${animal_name}`)
  ).json();

  if (!data || !data.image || !data.fact)
    return await interaction.reply({
      content: "There was an error, please try again.",
      ephemeral: true,
    });

  const embed = new EmbedBuilder()
    .setTitle(`${animal_name}`)
    .setColor(client.config.color)
    .setImage(data.image)
    .setDescription(data.fact)
    .setFooter({
      text: `Requested by ${interaction.user.username}`,
      iconURL: interaction.user.displayAvatarURL(),
    })
    .setTimestamp();

  return await interaction.reply({
    embeds: [embed],
  });
}

export const options: CommandOptions = {
  devOnly: false,
  deleted: false,
};
