import { CommandData, CommandOptions, SlashCommandProps } from "../../handler";

import { ApplicationCommandOptionType, EmbedBuilder } from "discord.js";

export const data: CommandData = {
  name: "reactionrole",
  description: "reaction role message command",
  options: [
    {
      name: "add",
      description: "Add a reaction role to a message",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "message-id",
          description: "the message to add reactions to",
          required: true,
          type: ApplicationCommandOptionType.String,
        },
        {
          name: "emoji",
          description: "the emoji to react with",
          required: true,
          type: ApplicationCommandOptionType.String,
        },
        {
          name: "role",
          description: "the role to add to the emoji",
          required: true,
          type: ApplicationCommandOptionType.Role,
        },
      ],
    },
    {
      name: "remove",
      description: "remove a reaction role to a message",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "message-id",
          description: "the message to add reactions to",
          required: true,
          type: ApplicationCommandOptionType.String,
        },
        {
          name: "emoji",
          description: "the emoji to react with",
          required: true,
          type: ApplicationCommandOptionType.String,
        },
      ],
    },
  ],
};

export async function run({ interaction, client, handler }: SlashCommandProps) {
  const db = client.db.reaction;

  const { options, guild, channel } = interaction;
  const sub = options.getSubcommand();
  const emoji = options.getString("emoji");
  const message_id = options.getString("message-id")!;

  let e;
  const message = await channel?.messages.fetch(message_id).catch((err) => {
    e = err;
  });

  if (e || !message)
    return await interaction.reply({
      content: `Be sure to get a message from ${channel}`,
      ephemeral: true,
    });

  if (!guild) return;

  const data = await db.findFirst({
    where: {
      guild_id: guild.id,
      message_id: message.id,
      emoji: emoji!,
    },
  });

  switch (sub) {
    case "add":
      if (data) {
        return await interaction.reply({
          content: `it looks like you already have this reaction setup, using the emoji ${emoji} on this message`,
          ephemeral: true,
        });
      }

      const role = options.getRole("role");
      await db.create({
        data: {
          guild_id: guild.id,
          message_id: message.id,
          emoji: emoji!,
          role: role!.id,
        },
      });

      const addEmbed = new EmbedBuilder()
        .setColor("Random")
        .setDescription(
          `I have added a reaction role to ${message.url} with ${emoji} and the role ${role}`
        )
        .setTimestamp();

      await message.react(emoji!).catch(() => {});

      await interaction.reply({
        embeds: [addEmbed],
        ephemeral: true,
      });

      break;
    case "remove":
      if (!data) {
        return await interaction.reply({
          content: `it doesnt look like that reaction role exists`,
          ephemeral: true,
        });
      }

      await db.deleteMany({
        where: {
          guild_id: guild.id,
          message_id: message.id,
          emoji: emoji!,
        },
      });

      const removeEmbed = new EmbedBuilder()
        .setColor("Random")
        .setDescription(
          `I have removed a reaction role ${message.url} with ${emoji}`
        )
        .setTimestamp();

      await interaction.reply({
        embeds: [removeEmbed],
        ephemeral: true,
      });
      break;
    default:
      break;
  }
}

export const options: CommandOptions = {
  devOnly: false,
  deleted: false,
  userPermissions: ["Administrator", "ManageRoles"],
};
