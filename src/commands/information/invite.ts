import { CommandData, CommandOptions, SlashCommandProps } from "../../handler";

import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
} from "discord.js";

export const data: CommandData = {
  name: "invite",
  description: "Invite the bot to your server!",
};

export async function run({ interaction, client, handler }: SlashCommandProps) {
  const inviteEmbed = new EmbedBuilder()
    .setTitle("Invite me to your server!")
    .setColor(client.config.color);

  // return interaction with embed and button to invite the bot
  const actionRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setLabel("Invite")
      .setStyle(ButtonStyle.Link)

      .setURL(
        `https://discord.com/api/oauth2/authorize?client_id=${
          interaction.client.user!.id
        }&permissions=8&scope=bot%20applications.commands`
      )
  );

  return await interaction
    .reply({ embeds: [inviteEmbed], components: [actionRow] })
    .catch(console.error);
}

export const options: CommandOptions = {
  devOnly: false,
  deleted: false,
};
