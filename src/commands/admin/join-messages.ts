import { ApplicationCommandOptionType } from "discord.js";
import { CommandData, CommandOptions, SlashCommandProps } from "../../handler";

export const data: CommandData = {
  name: "join_messages",
  description: "Set up join messages.",
  options: [
    {
      name: "channel",
      description: "The channel to send join messages to.",
      type: ApplicationCommandOptionType.Channel,
      required: true,
    },
  ],
};

export async function run({ interaction, client }: SlashCommandProps) {
  const { guild } = interaction;
  if (!guild) {
    return interaction.reply({
      content: "This command can only be used in a server.",
      ephemeral: true,
    });
  }

  const channel = interaction.options.getChannel("channel", true);
  const config = await client.db.guildConfig.findFirst({
    where: { guildId: guild.id },
  });

  if (!config) {
    return interaction.reply({
      content: "There’s no config for this server.",
      ephemeral: true,
    });
  }

  await client.db.channelSettings.upsert({
    where: { guildId: guild.id },
    create: {
      guildId: guild.id,
      channelIdMembers: channel.id,
    },
    update: {
      channelIdMembers: channel.id,
    },
  });

  await client.db.guildConfig.update({
    where: { guildId: guild.id },
    data: { joinMessages: true },
  });

  return interaction.reply({
    content: `Join messages will now be sent to ${channel}.`,
    ephemeral: true,
  });
}

export const options: CommandOptions = {
  devOnly: false,
  deleted: false,
  userPermissions: ["Administrator"],
};
