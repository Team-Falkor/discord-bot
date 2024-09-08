import { colors } from "../../handler";
import { ClientClass } from "../../structure/Client";

export class ModLogs {
  public guilds: Map<
    string,
    {
      channelId: string;
    }
  > = new Map();

  set(guildId: string, channelId: string) {
    this.guilds.set(guildId, {
      channelId,
    });
  }

  get(guildId: string) {
    return this.guilds.get(guildId);
  }

  delete(guildId: string) {
    this.guilds.delete(guildId);
  }

  has(guildId: string) {
    return this.guilds.has(guildId);
  }

  clear() {
    this.guilds.clear();
  }

  size() {
    return this.guilds.size;
  }

  keys() {
    return this.guilds.keys();
  }

  values() {
    return this.guilds.values();
  }

  entries() {
    return this.guilds.entries();
  }

  async init(client: ClientClass) {
    console.log(colors.yellow("Loading Mod Logs Channels..."));
    const guilds = await client.db.moderationChannel.findMany();

    if (!guilds) return;

    for (const guild of guilds) {
      if (!guild.guild_id || !guild.channel_id) continue;
      this.guilds.set(guild.guild_id, {
        channelId: guild.channel_id,
      });
    }

    console.log(colors.green("Loaded Mod Logs Channels."));
  }
}
