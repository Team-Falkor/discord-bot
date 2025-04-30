import { ApplicationCommandOptionType, EmbedBuilder } from "discord.js";
import { CommandData, CommandOptions, SlashCommandProps } from "../../handler";

export const data: CommandData = {
  name: "autojoinrole",
  description: "Auto join role giver",
  options: [
    {
      name: "add",
      description: "Add an auto join role to the server",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "role",
          description: "The role to add",
          required: true,
          type: ApplicationCommandOptionType.Role,
        },
      ],
    },
    {
      name: "remove",
      description: "Remove an auto join role from the server",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "role",
          description: "The role to remove",
          required: true,
          type: ApplicationCommandOptionType.Role,
        },
      ],
    },
  ],
};

export async function run({ interaction, client }: SlashCommandProps) {
  const db = client.db.autoJoinRoles;

  const { options, guild } = interaction;
  const sub = options.getSubcommand();
  const role = options.getRole("role");

  if (!guild) return;

  // Ensure the Guild exists in DB
  await client.db.guild.upsert({
    where: { id: guild.id },
    update: {},
    create: {
      id: guild.id,
      name: guild.name,
    },
  });

  const existingRole = await db.findFirst({
    where: {
      guildId: guild.id,
      role: role?.id!,
    },
  });

  switch (sub) {
    case "add":
      if (existingRole) {
        return await interaction.reply({
          content: `That role is already configured as an auto join role.`,
          ephemeral: true,
        });
      }

      await db.create({
        data: {
          guildId: guild.id,
          role: role!.id,
        },
      });

      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle("Auto Join Role Added")
            .setColor("Random")
            .setDescription(`Added auto join role ${role} to ${guild}.`)
            .setTimestamp(),
        ],
        ephemeral: true,
      });

      break;

    case "remove":
      if (!existingRole) {
        return await interaction.reply({
          content: `That role isn't configured as an auto join role.`,
          ephemeral: true,
        });
      }

      await db.deleteMany({
        where: {
          guildId: guild.id,
          role: role!.id,
        },
      });

      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle("Auto Join Role Removed")
            .setColor("Random")
            .setDescription(`Removed auto join role ${role} from ${guild}.`)
            .setTimestamp(),
        ],
        ephemeral: true,
      });

      break;
  }
}

export const options: CommandOptions = {
  devOnly: false,
  deleted: false,
  userPermissions: ["Administrator", "ManageRoles"],
};
