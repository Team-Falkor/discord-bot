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

export default async function handleCountingGame(
  message: Message | PartialMessage,
  client: ClientClass
) {
  // Early return if the message is not in a guild
  if (
    !message.guild ||
    !message.content ||
    !message.author ||
    message.author.bot
  ) {
    return;
  }

  const guildId = message.guild.id;
  const db = client.db.counting_game;

  // Parse the message content to a number
  const messageNumber = parseInt(message.content);
  if (isNaN(messageNumber)) return;

  // Fetch counting game data for the guild
  const data = await db.findFirst({ where: { guild_id: guildId } });
  if (!data) return;

  // Ensure the message is in the correct channel
  if (message.channel.id !== data.channel_id) return;

  // Verify the channel supports sending messages
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

  // Check if the user repeated or the number is wrong
  const isWrongCount =
    message.author.id === data.last_person_id || messageNumber !== data.count;

  if (isWrongCount) {
    const responses = [
      "it's okay <USER>, let's try again!",
      "it's okay <USER>, try again!",
      "it's okay <USER>, try harder!",
      "The count is wrong <USER>, try again!",
    ];
    const randomResponse = responses[
      Math.floor(Math.random() * responses.length)
    ].replace("<USER>", `<@${message.author.id}>`);

    // Reset the game and notify the user
    await db.updateMany({
      where: { guild_id: guildId, channel_id: data.channel_id },
      data: { last_person_id: "", count: 1 },
    });

    const embed = new EmbedBuilder()
      .setTitle(`Counting | ${message.guild.name}`)
      .setColor("Red")
      .setDescription(randomResponse)
      .setTimestamp();

    const msg = await message.channel.send({ embeds: [embed] });
    await msg.react("😡");
    await message.react("❌");

    return;
  }

  // React with 💯 for 100 or ✅ for other correct numbers
  const reaction = messageNumber === 100 ? "💯" : "✅";
  await message.react(reaction);

  // Update the game state in the database
  await db.updateMany({
    where: { guild_id: guildId, channel_id: data.channel_id },
    data: {
      last_person_id: message.author.id,
      count: data.count + 1,
    },
  });
}
