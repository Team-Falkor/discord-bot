import { PrismaClient } from "@prisma/client";
import { Client, Collection } from "discord.js";
import path from "node:path";
import { clientOptions } from "./utils/ClientOptions";

import { colors, Handler } from "../handler";
import { config } from "../utils/config";
import { IGDB } from "../utils/igdb";
import { Cooldowns } from "./Cooldowns";
import { ModLogs } from "./logs";

export class ClientClass extends Client {
  public buttons = new Collection();

  // Prisma client instance
  public db = new PrismaClient();

  // Expose models directly for convenience
  public pollVotes = this.db.pollVotes;
  public reaction = this.db.reaction;
  public countingGame = this.db.countingGame;

  public console = console;
  public config = config;

  public igdb: IGDB = new IGDB();
  public modLogs = new ModLogs();
  public cooldowns = new Cooldowns();

  constructor() {
    super(clientOptions);
  }

  public async init() {
    console.info(colors.yellow("Bot is loading..."));

    await this.modLogs.init(this);

    new Handler({
      client: this,
      commandsPath: path.join(__dirname, "..", "commands"),
      eventsPath: path.join(__dirname, "..", "events"),
      componentsPath: path.join(__dirname, "..", "components"),
      validationsPath: path.join(__dirname, "..", "validations"),
    });

    const TOKEN =
      process.env.NODE_ENV === "production"
        ? process.env.BotToken
        : process.env.BotToken_DEV;
    await this.login(TOKEN);
  }
}
