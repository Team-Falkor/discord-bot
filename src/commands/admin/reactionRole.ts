import { ApplicationCommandOptionType, EmbedBuilder } from "discord.js";
import { CommandData, CommandOptions, SlashCommandProps } from "../../handler";

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
          description: "the role to add when the emoji is used",
          required: true,
          type: ApplicationCommandOptionType.Role,
        },
      ],
    },
    {
      name: "remove",
      description: "Remove a reaction role from a message",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "message-id",
          description: "the message to remove the reaction from",
          required: true,
          type: ApplicationCommandOptionType.String,
        },
        {
          name: "emoji",
          description: "the emoji whose role binding to remove",
          required: true,
          type: ApplicationCommandOptionType.String,
        },
      ],
    },
  ],
};

export async function run({ interaction, client }: SlashCommandProps) {
  const db = client.reaction;

  const { options, guild, channel } = interaction;
  const sub = options.getSubcommand();
  const emoji = options.getString("emoji", true);
  const messageId = options.getString("message-id", true);

  if (!channel) {
    return interaction.reply({
      content: "Could not find the channel for this interaction.",
      ephemeral: true,
    });
  }

  // fetch the target message
  let targetMsg;
  try {
    targetMsg = await channel.messages.fetch(messageId);
  } catch {
    return interaction.reply({
      content: `I couldn't fetch that message in ${channel.toString()}.`,
      ephemeral: true,
    });
  }

  if (!guild) {
    return interaction.reply({
      content: "This command only works in a server.",
      ephemeral: true,
    });
  }

  // Ensure the Guild exists in DB
  await client.db.guild.upsert({
    where: { id: guild.id },
    update: {},
    create: {
      id: guild.id,
      name: guild.name,
    },
  });

  const existing = await db.findFirst({
    where: {
      guildId: guild.id,
      messageId: targetMsg.id,
      emoji: emoji,
    },
  });

  if (sub === "add") {
    if (existing) {
      return interaction.reply({
        content: `There's already a reaction role for ${emoji} on that message.`,
        ephemeral: true,
      });
    }

    const role = options.getRole("role", true);

    await db.create({
      data: {
        guildId: guild.id,
        messageId: targetMsg.id,
        emoji: emoji,
        role: role.id,
      },
    });

    // react on the message
    await targetMsg.react(emoji).catch(() => {});

    const embed = new EmbedBuilder()
      .setColor("Random")
      .setDescription(
        `Added reaction role on [that message](${targetMsg.url}):\n` +
          `React with ${emoji} to get ${role.toString()}`
      )
      .setTimestamp();

    return interaction.reply({ embeds: [embed], ephemeral: true });
  }

  // sub === "remove"
  if (!existing) {
    return interaction.reply({
      content: `No reaction role found for ${emoji} on that message.`,
      ephemeral: true,
    });
  }

  await db.deleteMany({
    where: {
      guildId: guild.id,
      messageId: targetMsg.id,
      emoji: emoji,
    },
  });

  const embed = new EmbedBuilder()
    .setColor("Random")
    .setDescription(
      `Removed reaction role binding for ${emoji} on [that message](${targetMsg.url}).`
    )
    .setTimestamp();

  return interaction.reply({ embeds: [embed], ephemeral: true });
}

export const options: CommandOptions = {
  devOnly: false,
  deleted: false,
  userPermissions: ["Administrator", "ManageRoles"],
};
