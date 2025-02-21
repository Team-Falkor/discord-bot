import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(duration);
dayjs.extend(relativeTime);

import { EmbedBuilder, HexColorString } from "discord.js";
import { getPingStats, toFixedNumber } from "../../functions";
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
  const pingStats = await getPingStats(client);
  const uptime = dayjs.duration(pingStats.uptime).humanize();
  const clientLatency = Date.now() - interaction.createdTimestamp;

  const embed = new EmbedBuilder()
    .setTitle("🏓 PONG!")
    .setColor((client as ClientClass).config.color as HexColorString)
    .addFields(
      {
        name: "API Latency",
        value: `${pingStats.apiLatency}ms`,
        inline: true,
      },
      {
        name: "Client Latency",
        value: `${clientLatency}ms`,
        inline: true,
      },
      {
        name: "Memory Usage",
        value: `${toFixedNumber(pingStats.memoryUsage)}mb`,
        inline: true,
      },
      {
        name: "CPU Usage",
        value: `${pingStats.cpuUsage}%`,
        inline: true,
      }
    )
    .setFooter({ text: `Up for ${uptime}` })
    .setTimestamp();

  await interaction.reply({ embeds: [embed] });
}

export const options: CommandOptions = {
  devOnly: false,
  deleted: false,
};
