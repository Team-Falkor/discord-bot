import {
  ActivityType,
  type ClientOptions,
  GatewayIntentBits,
  Options,
  Partials,
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
  partials: [Partials.Reaction, Partials.Message, Partials.Message],
  makeCache: Options.cacheEverything(),
};
