import { CommandData, CommandOptions, SlashCommandProps } from "../../handler";

import { ApplicationCommandOptionType, EmbedBuilder } from "discord.js";

export const data: CommandData = {
  name: "nickname",
  description: "Change the name of the bot, in the server.",
  options: [
    {
      name: "name",
      description: "The new name.",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],
};

export async function run({ interaction, client, handler }: SlashCommandProps) {
  const name = interaction.options.getString("name", true);

  const embed = new EmbedBuilder()
    .setColor(client.config.color)
    .setTitle("Name Changed")
    .addFields({
      name: "Name",
      value: name,
    })
    .setFooter({ text: `Requested by ${interaction.user.tag}` })
    .setTimestamp();

  try {
    await interaction.guild?.members.me?.setNickname(name);

    await interaction.reply({ embeds: [embed] });
  } catch (error) {
    await interaction.reply({ content: `An error occured`, ephemeral: true });
    console.error(error);
  }
}

export const options: CommandOptions = {
  devOnly: false,
  deleted: false,
  userPermissions: ["Administrator"],
};
