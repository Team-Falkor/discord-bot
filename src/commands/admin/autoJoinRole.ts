import { CommandData, CommandOptions, SlashCommandProps } from "../../handler";

import { ApplicationCommandOptionType, EmbedBuilder } from "discord.js";

export const data: CommandData = {
  name: "autojoinrole",
  description: "auto join role giver",
  options: [
    {
      name: "add",
      description: "Add a auto join role to the server",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "role",
          description: "the role to add",
          required: true,
          type: ApplicationCommandOptionType.Role,
        },
      ],
    },
    {
      name: "remove",
      description: "Remove a auto join role to the server",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "role",
          description: "the role to remove",
          required: true,
          type: ApplicationCommandOptionType.Role,
        },
      ],
    },
  ],
};

export async function run({ interaction, client, handler }: SlashCommandProps) {
  const db = client.db.autoJoinRoles;

  const { options, guild } = interaction;
  const sub = options.getSubcommand();
  const role = options.getRole("role");

  if (!guild) return;

  const data = await db.findFirst({
    where: {
      guild_id: guild.id,
      role: role?.id!,
    },
  });

  switch (sub) {
    case "add":
      if (data) {
        return await interaction.reply({
          content: `it looks like you already have this auto join role setup`,
          ephemeral: true,
        });
      }

      await db.create({
        data: {
          guild_id: guild.id,
          role: role!.id,
        },
      });

      const addEmbed = new EmbedBuilder()
        .setTitle("Auto Join Role Added")
        .setColor("Random")
        .setDescription(
          `I have added a auto join role to ${guild} with ${role}`
        )
        .setTimestamp();

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
          role: role!.id,
        },
      });

      const removeEmbed = new EmbedBuilder()
        .setTitle("Auto Join Role Removed")
        .setColor("Random")
        .setDescription(`I have removed a join role to ${guild} with ${role}`)
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
