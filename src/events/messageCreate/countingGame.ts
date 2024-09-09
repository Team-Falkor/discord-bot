import {
  DMChannel,
  EmbedBuilder,
  Message,
  NewsChannel,
  PartialMessage,
  TextChannel,
  ThreadChannel,
} from "discord.js";
import { ClientClass } from "../../structure/Client";

export default async function (
  message: Message | PartialMessage,
  client: ClientClass
) {
  // Early return if the message is not from a guild
  if (!message.guild) return;

  const guildId = message.guild.id;

  // Early return if the author is invalid, a bot, or content is missing
  if (!message.author || message.author.bot || !message.content) return;

  console.log(message.content);

  const message_number = parseInt(message.content);

  // Early return if the message content is not a number
  if (isNaN(message_number)) return;

  const db = client.db.counting_game;

  // Fetch the counting game data for this guild
  const data = await db.findFirst({
    where: {
      guild_id: guildId,
    },
  });
  if (!data) return;

  // Ensure the message is sent in the right channel
  if (message.channel.id !== data.channel_id) return;

  // Check if the channel supports the 'send' method
  if (
    !(
      message.channel instanceof TextChannel ||
      message.channel instanceof DMChannel ||
      message.channel instanceof NewsChannel ||
      message.channel instanceof ThreadChannel
    )
  ) {
    console.error("Unsupported channel type for sending messages.");
    return;
  }

  // Handle incorrect counting cases
  if (
    message.author.id === data.last_person_id ||
    message_number !== data.count
  ) {
    const list = [
      `it's okay <USER>, let's try again!`,
      `it's okay <USER>, try again!`,
      `it's okay <USER>, try harder!`,
      `The count is wrong <USER>, try again!`,
    ];
    const randomItem = list[Math.floor(Math.random() * list.length)].replace(
      "<USER>",
      `<@${message.author.id}>`
    );

    // Reset the counting game in the database
    await db.updateMany({
      where: {
        guild_id: guildId,
        channel_id: data.channel_id,
      },
      data: {
        last_person_id: "",
        count: 1,
      },
    });

    // Send an embedded message with the random comment
    const embed = new EmbedBuilder()
      .setTitle(`Counting | ${message.guild.name}`)
      .setColor("Red")
      .setDescription(randomItem)
      .setTimestamp();

    const msg = await message.channel.send({ embeds: [embed] });
    await msg.react("😡");
    await message.react("❌");

    return;
  }

  // React based on the message number (💯 for 100, otherwise ✅)
  if (message_number === 100 && data.count === 100) {
    await message.react("💯");
  } else {
    await message.react("✅");
  }

  // Update the game state in the database
  await db.updateMany({
    where: {
      guild_id: guildId,
      channel_id: data.channel_id,
    },
    data: {
      last_person_id: message.author.id,
      count: data.count + 1,
    },
  });
}
