import { CommandData, CommandOptions, SlashCommandProps } from "../../handler";

import { ApplicationCommandOptionType } from "discord.js";

export const data: CommandData = {
  name: "join_messages",
  description: "Setup join messages.",
  options: [
    {
      name: "channel",
      description: "The channel to send join messages to.",
      type: ApplicationCommandOptionType.Channel,
      required: true,
    },
  ],
};

export async function run({ interaction, client, handler }: SlashCommandProps) {
  const channelSettingsDB = client.db.channelSettings;
  const configDB = client.db.guild_config;

  if (!interaction.guild) {
    return await interaction.reply({
      content: "This command can only be used in a server",
      ephemeral: true,
    });
  }

  const config = await configDB.findFirst({
    where: {
      guild_id: interaction.guild.id,
    },
  });

  if (!config) {
    return await interaction.reply({
      content: "There is no config for this server",
      ephemeral: true,
    });
  }

  const channel = interaction.options.getChannel("channel", true);

  await channelSettingsDB.upsert({
    where: {
      guid_id: interaction.guild.id,
    },
    create: {
      guid_id: interaction.guild.id,
      join_messages: channel.id,
    },
    update: {
      join_messages: channel.id,
    },
  });

  await configDB.upsert({
    where: {
      guild_id: interaction.guild.id,
    },
    create: {
      guild_id: interaction.guild.id,
      join_messages: true,
    },
    update: {
      join_messages: true,
    },
  });

  await interaction.reply({
    content: `Join messages set to ${channel}`,
    ephemeral: true,
  });
}

export const options: CommandOptions = {
  devOnly: false,
  deleted: false,
  userPermissions: ["Administrator"],
};
