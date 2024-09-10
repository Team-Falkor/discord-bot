import { colors } from "../../handler";
import { ClientClass } from "../../structure/Client";

interface GuildsSettings {
  channelId: string;
  settings: {
    id: number;
    deleted_message: boolean;
    edited_message: boolean;
    user_left: boolean;
    user_join: boolean;
    user_ban: boolean;
    user_timeout: boolean;
    user_kick: boolean;
  };
}

export class ModLogs {
  public guilds: Map<string, GuildsSettings> = new Map();

  // Set guild settings
  set(guildId: string, settings: GuildsSettings) {
    this.guilds.set(guildId, settings);
  }

  // Get guild settings
  get(guildId: string) {
    return this.guilds.get(guildId);
  }

  // Delete guild settings
  delete(guildId: string) {
    this.guilds.delete(guildId);
  }

  // Check if guild settings exist
  has(guildId: string) {
    return this.guilds.has(guildId);
  }

  // Clear all guilds
  clear() {
    this.guilds.clear();
  }

  // Get the size of the guilds map
  size() {
    return this.guilds.size;
  }

  // Get all guild keys
  keys() {
    return this.guilds.keys();
  }

  // Get all guild values
  values() {
    return this.guilds.values();
  }

  // Get all entries in the guild map
  entries() {
    return this.guilds.entries();
  }

  // Change multiple settings at once for a guild
  changeSettings(
    guildId: string,
    newSettings: Partial<GuildsSettings["settings"]>
  ) {
    const guildSettings = this.get(guildId);
    if (!guildSettings) return;

    // Update only the provided settings
    guildSettings.settings = { ...guildSettings.settings, ...newSettings };
    this.set(guildId, guildSettings);
  }

  // Change a single setting in the guild settings
  changeSetting<K extends keyof GuildsSettings["settings"]>(
    guildId: string,
    settingKey: K,
    value: GuildsSettings["settings"][K]
  ) {
    const guildSettings = this.get(guildId);
    if (!guildSettings) return;

    // Update the specific setting
    guildSettings.settings[settingKey] = value;
    this.set(guildId, guildSettings);
  }

  // Initialize guild settings from the database
  async init(client: ClientClass) {
    console.log(colors.yellow("Loading Mod Logs Channels..."));

    const guilds = await client.db.moderationChannel.findMany({
      select: {
        channel_id: true,
        guild_id: true,
        id: true,
        settings: true,
      },
    });

    if (!guilds) return;

    for (const guild of guilds) {
      if (!guild.guild_id || !guild.channel_id) continue;

      this.set(guild.guild_id, {
        channelId: guild.channel_id,
        settings: guild.settings,
      });
    }

    console.log(colors.green("Loaded Mod Logs Channels."));
  }
}
