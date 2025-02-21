import { Client } from "discord.js";
import osu from "node-os-utils";

export const getPingStats = async (client: Client) => {
  const cpuUsage = await osu.cpu.usage();

  return {
    apiLatency: Math.max(client.ws.ping, 0),
    memoryUsage:
      Math.round((process.memoryUsage().heapUsed / 1024 / 1024) * 100) / 100,
    uptime: client.uptime ?? 0,
    cpuUsage: cpuUsage ?? 0,
  };
};
