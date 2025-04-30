import {
  DMChannel,
  EmbedBuilder,
  Message,
  NewsChannel,
  PartialMessage,
  TextChannel,
  ThreadChannel,
} from "discord.js";
import { parseStringToNumber } from "../../functions";
import { ClientClass } from "../../structure/Client";
import { constants } from "../../utils";

export default async function handleCountingGame(
  message: Message | PartialMessage,
  client: ClientClass
) {
  // Guards: must be in a guild, have content, non-bot author, and a supported channel
  if (
    !message.guild ||
    !message.content ||
    message.author?.bot ||
    !(
      message.channel instanceof TextChannel ||
      message.channel instanceof DMChannel ||
      message.channel instanceof NewsChannel ||
      message.channel instanceof ThreadChannel
    )
  ) {
    return;
  }

  const author = message.author;
  if (!author) return;

  const guildId = message.guild.id;
  const channelId = message.channel.id;
  const discordUserId = author.id;

  const countingDb = client.db.countingGame;

  // Parse the number from the message
  const parsed = parseStringToNumber(message.content);
  const messageNumber = parsed ?? Number.parseInt(message.content, 10);
  if (Number.isNaN(messageNumber)) return;

  // Load the counting‐game config for this channel
  const gameData = await countingDb.findUnique({ where: { channelId } });
  if (!gameData) return;

  // Load the user's score record (if any)
  let userRecord = await client.db.user.findFirst({
    where: { discordId: discordUserId, guildId },
  });

  // Determine if this is a wrong count:
  // - number is wrong, OR
  // - same user as last time (compare Prisma user.id)
  const sameUser =
    userRecord !== null && gameData.lastPersonId === userRecord.id;
  const wrongNumber = messageNumber !== gameData.count;
  const wrongCount = sameUser || wrongNumber;

  if (wrongCount) {
    // Decrement or initialize at -1
    if (!userRecord) {
      await client.db.user.create({
        data: {
          discordId: discordUserId,
          guildId,
          countingScore: -1,
        },
      });
    } else {
      await client.db.user.update({
        where: { id: userRecord.id },
        data: { countingScore: { decrement: 1 } },
      });
    }

    // Reset the game back to 1, clear lastPersonId
    await countingDb.update({
      where: { channelId },
      data: { lastPersonId: null, count: 1 },
    });

    // Send a random “wrong answer” response
    const responses = constants.counting_game.responses;
    const random = responses[
      Math.floor(Math.random() * responses.length)
    ].replace("<USER>", `<@${discordUserId}>`);

    const embed = new EmbedBuilder()
      .setTitle(`Counting | ${message.guild.name}`)
      .setColor("Red")
      .setDescription(random)
      .setTimestamp();

    const reply = await message.channel.send({ embeds: [embed] });
    await reply.react("😡");
    await message.react("❌");
    return;
  }

  // ✅ Correct count: react first
  await message.react(messageNumber === 100 ? "💯" : "✅");

  // Ensure the userRecord exists and get its Prisma UUID id
  if (!userRecord) {
    userRecord = await client.db.user.create({
      data: {
        discordId: discordUserId,
        guildId,
        countingScore: 1,
      },
    });
  } else {
    userRecord = await client.db.user.update({
      where: { id: userRecord.id },
      data: { countingScore: { increment: 1 } },
    });
  }

  // Advance the game state with the Prisma user.id
  await countingDb.update({
    where: { channelId },
    data: {
      lastPersonId: userRecord.id,
      count: { increment: 1 },
    },
  });
}
