import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(duration);
dayjs.extend(relativeTime);

import {
	ApplicationCommandOptionType,
	EmbedBuilder,
	type HexColorString,
} from "discord.js";
import type {
	CommandData,
	CommandOptions,
	SlashCommandProps,
} from "../../handler/@types";

export const data: CommandData = {
	name: "ban",
	description: "Bans a user.",
	options: [
		{
			name: "user",
			description: "The user to ban.",
			type: ApplicationCommandOptionType.User,
			required: true,
		},
		{
			name: "reason",
			description: "The reason for the ban.",
			type: ApplicationCommandOptionType.String,
			required: false,
		},
		{
			name: "delete_messages",
			description: "Delete messages from the user (1-7 days).",
			type: ApplicationCommandOptionType.Integer,
			required: false,
			choices: [
				{ name: "Don't delete", value: 0 },
				{ name: "1 day", value: 1 },
				{ name: "2 days", value: 2 },
				{ name: "3 days", value: 3 },
				{ name: "7 days", value: 7 },
			],
		},
	],
};

export async function run({ interaction, client }: SlashCommandProps) {
	const user = interaction.options.getUser("user", true);
	const reason = interaction.options.getString("reason", false);
	const deleteMessages =
		interaction.options.getInteger("delete_messages", false) || 0;

	if (!interaction.guild) return;

	// Ensure the Guild exists in DB
	await client.db.guild.upsert({
		where: { id: interaction.guild.id },
		update: {},
		create: {
			id: interaction.guild.id,
			name: interaction.guild.name,
		},
	});

	try {
		user.send(
			`You have been banned from ${interaction.guild.name} for ${
				reason || "No reason provided"
			}.`,
		);

		await interaction.guild.members.ban(user, {
			reason: reason || "No reason provided",
			deleteMessageSeconds: deleteMessages * 24 * 60 * 60,
		});

		const embed = new EmbedBuilder()
			.setTitle("🔨 Banned User")
			.setColor(client.config.color as HexColorString)
			.addFields(
				{
					name: "User",
					value: user.toString(),
					inline: true,
				},
				{
					name: "Moderator",
					value: interaction.user.toString(),
					inline: true,
				},
				{
					name: "Reason",
					value: reason || "No reason provided",
					inline: true,
				},
			)
			.setFooter({
				text: `User ID: ${user.id}`,
			})
			.setTimestamp();

		await interaction.reply({ embeds: [embed] });
	} catch (error) {
		console.log(error);
	}
}

export const options: CommandOptions = {
	devOnly: false,
	botPermissions: ["BanMembers"],
	userPermissions: ["BanMembers", "Administrator"],
	deleted: false,
};
