import { CommandData, CommandOptions, SlashCommandProps } from "../../handler";

import {
  ApplicationCommandOptionType,
  ChannelType,
  ChatInputCommandInteraction,
  EmbedBuilder,
  TextChannel,
} from "discord.js";

export const data: CommandData = {
  name: "counting",
  description: "configure the counting system",
  options: [
    {
      name: "setup",
      description: "the channel to send the messages",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "channel",
          description: "the channel to send the messages",
          channel_types: [ChannelType.GuildText],
          required: true,
          type: ApplicationCommandOptionType.Channel,
        },
      ],
    },
    {
      name: "mute",
      description: "mute the user from the counting game",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "user",
          description: "the user to mute",
          type: ApplicationCommandOptionType.User,
          required: true,
        },
      ],
    },
    {
      name: "unmute",
      description: "unmute the user from the counting game",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "user",
          description: "the user to mute",
          type: ApplicationCommandOptionType.User,
          required: true,
        },
      ],
    },
  ],
};

export async function run({ interaction, client, handler }: SlashCommandProps) {
  const { options, guildId, guild, member } =
    interaction as ChatInputCommandInteraction<"cached">;
  const subcommand = options.getSubcommand();

  const channel = options.getChannel("channel")!;
  const user = options.getUser("user")!;

  const errEmbed = new EmbedBuilder()
    .setColor("Red")
    .setDescription("⛔ Something went wrong")
    .setTimestamp();

  const db = client.db.counting_game;

  const data = await db.findFirst({
    where: {
      guild_id: guildId!,
    },
  });

  switch (subcommand) {
    case "setup":
      if (!data) {
        await db.create({
          data: {
            channel_id: channel.id,
            guild_id: guildId!,
            last_person_id: "",
            count: 1,
          },
        });

        const embed = new EmbedBuilder()
          .setColor("Green")
          .setDescription(`✅ Setup the counting system in ${channel}`)
          .setTimestamp();

        return await interaction.reply({
          embeds: [embed],
          ephemeral: true,
        });
      } else if (data) {
        await db.updateMany({
          where: {
            guild_id: guildId!,
          },
          data: {
            channel_id: channel.id,
          },
        });

        const embed = new EmbedBuilder()
          .setColor("Green")
          .setDescription(`✅ Setup the counting system in ${channel}`)
          .setTimestamp();

        return await interaction.reply({
          embeds: [embed],
          ephemeral: true,
        });
      }

      break;

    case "unmute":
      if (!data) {
        const embed = new EmbedBuilder()
          .setColor("Red")
          .setDescription(`⛔ The counting system is not setup in this server`)
          .setTimestamp();

        return await interaction.reply({
          embeds: [embed],
          ephemeral: true,
        });
      } else if (data) {
        const ch = (await guild!.channels.fetch(
          data.channel_id
        )) as TextChannel;

        await ch.permissionOverwrites.edit(user.id, {
          SendMessages: true,
        });

        const embed = new EmbedBuilder()
          .setColor("Green")
          .setDescription(`✅  un-muted ${user} from the counting game`)
          .setTimestamp()
          .setFooter({
            text: `un-muted by ${member!.user.username}`,
            iconURL: interaction.user.displayAvatarURL(),
          });

        return await interaction.reply({
          embeds: [embed],
          ephemeral: true,
        });
      }

      break;

    case "mute":
      if (!data) {
        const embed = new EmbedBuilder()
          .setColor("Red")
          .setDescription(`⛔ The counting system is not setup in this server`)
          .setTimestamp();

        return await interaction.reply({
          embeds: [embed],
          ephemeral: true,
        });
      } else if (data) {
        const ch = (await guild!.channels.fetch(
          data.channel_id
        )) as TextChannel;

        await ch.permissionOverwrites.edit(user.id, {
          SendMessages: false,
        });

        const embed = new EmbedBuilder()
          .setColor("Green")
          .setDescription(`✅  Muted ${user} from the counting game`)
          .setTimestamp()
          .setFooter({
            text: `Muted by ${member!.user.username}`,
            iconURL: interaction.user.displayAvatarURL(),
          });

        return await interaction.reply({
          embeds: [embed],
          ephemeral: true,
        });
      }

    default:
      break;
  }
}

export const options: CommandOptions = {
  devOnly: false,
  deleted: false,
  userPermissions: ["Administrator"],
};
