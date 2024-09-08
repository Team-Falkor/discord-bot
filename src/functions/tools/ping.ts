import { Client } from "discord.js";

export const pingStats = (client: Client) => {
  const ping = client.ws.ping;
  const memoryUsage = process.memoryUsage().heapUsed / 1024 / 1024;
  const uptiime = client.uptime;

  return {
    apiLatency: ping,
    memoryUsage: memoryUsage,
    uptime: uptiime,
  };
};
