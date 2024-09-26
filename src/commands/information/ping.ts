import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(duration);
dayjs.extend(relativeTime);

import { EmbedBuilder, HexColorString } from "discord.js";
import { pingStats, toFixedNumber } from "../../functions";
import {
  CommandData,
  CommandOptions,
  SlashCommandProps,
} from "../../handler/@types";
import { ClientClass } from "../../structure/Client";

export const data: CommandData = {
  name: "ping",
  description: "Pong!",
};

export async function run({ interaction, client, handler }: SlashCommandProps) {
  const data = pingStats(client);
  const uptime = dayjs.duration(client.uptime!).humanize();

  const embed = new EmbedBuilder()
    .setTitle("🏓 PONG!")
    .setColor((client as ClientClass).config.color as HexColorString)
    .addFields(
      {
        name: "Api Latency",
        value: `${data.apiLatency}ms`,
        inline: true,
      },
      {
        name: "Client Latency",
        value: `${
          Date.now() - new Date(interaction.createdTimestamp).getTime()
        }ms`,
        inline: true,
      },
      {
        name: "Memory Usage",
        value: `${toFixedNumber(data.memoryUsage)}mb`,
        inline: true,
      }
    )
    .setFooter({
      text: `Up for  ${uptime}`,
    })
    .setTimestamp();

  await interaction.reply({ embeds: [embed] });
}

export const options: CommandOptions = {
  devOnly: false,
  deleted: false,
};
