import { Client } from "discord.js";

export const pingStats = (client: Client) => {
  const ping = client.ws.ping;
  const memoryUsage = process.memoryUsage().heapUsed / 1024 / 1024;
  const uptiime = client.uptime;

  const cpuUsage = () => {
    const cpu = process.cpuUsage();
    return (cpu.user + cpu.system) / 1000000;
  };

  return {
    apiLatency: ping,
    memoryUsage: memoryUsage,
    uptime: uptiime,
    cpuUsage: cpuUsage(),
  };
};
