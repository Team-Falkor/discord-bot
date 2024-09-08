import {
  ActivityType,
  type ClientOptions,
  GatewayIntentBits,
  Options,
} from "discord.js";

export const clientOptions: ClientOptions = {
  presence: {
    status: "dnd",
    activities: [
      { name: "Flying Above the ocean!", type: ActivityType.Playing },
    ],
  },
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildEmojisAndStickers,
  ],
  makeCache: Options.cacheEverything(),
};
