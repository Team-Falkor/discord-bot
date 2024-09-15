import { CommandInteraction } from "discord.js";
import { ValidationProps } from "../handler";

export default function ({
  interaction,
  commandObj,
  handler,
}: ValidationProps) {
  const cooldowns = handler.client.cooldowns;

  if (cooldowns.check(interaction.user.id)) {
    if (!(interaction instanceof CommandInteraction)) return true;

    interaction.reply({
      content: "You are on cooldown. Please wait a few seconds.",
      ephemeral: true,
    });

    return true;
  }

  cooldowns.set(interaction.user.id);
  return false;
}
