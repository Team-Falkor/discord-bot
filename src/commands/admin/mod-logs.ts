import { ApplicationCommandOptionType } from "discord.js";
import { CommandData, SlashCommandProps, CommandOptions } from "../../handler";

export const data: CommandData = {
  name: "modlogs",
  description: "Setup mod logs.",
  options: [
    {
      name: "channel",
      description: "The channel to send mod logs to.",
      type: ApplicationCommandOptionType.Channel,
      required: true,
    },
  ],
};

export async function run({ interaction, client, handler }: SlashCommandProps) {
  const db = client.db;
  const channel = interaction.options.getChannel("channel", true);

  const check = await db.moderationChannel.findFirst({
    where: {
      guild_id: interaction.guild?.id!,
    },
  });

  if (check?.channel_id === channel.id) {
    await interaction.reply({
      content: "This channel is already set as the mod logs channel.",
      ephemeral: true,
    });
  } else {
    await db.moderationChannel.upsert({
      where: {
        guild_id: interaction.guild?.id!,
      },
      create: {
        guild_id: interaction.guild?.id!,
        channel_id: channel.id,
        settings: {
          create: {},
        },
      },
      update: {
        channel_id: channel.id,
      },
    });

    client.modLogs.set(interaction.guild?.id!, channel.id);
    return await interaction.reply({
      content: "Successfully set mod logs channel.",
      ephemeral: true,
    });
  }

  client.modLogs.set(interaction.guild?.id!, channel.id);
  await interaction.reply({
    content: "Successfully set mod logs channel.",
    ephemeral: true,
  });
}

export const options: CommandOptions = {
  devOnly: false,
  deleted: false,
  userPermissions: ["Administrator"],
};
