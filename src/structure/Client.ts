import { PrismaClient } from "@prisma/client";
import Console from "@tdanks2000/fancyconsolelog";
import { Client, Collection } from "discord.js";
import path from "node:path";
import { clientOptions } from "./utils/ClientOptions";

const console = new Console();

import { colors, Handler } from "../handler";
import { config } from "../utils/config";
import { ModLogs } from "./logs";

export class ClientClass extends Client {
  public buttons = new Collection();
  public db = new PrismaClient();
  public console = console;
  public config = config;

  public modLogs = new ModLogs();

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
    });

    const TOKEN =
      process.env.NODE_ENV === "production"
        ? process.env.BotToken
        : process.env.BotToken_DEV;
    await this.login(TOKEN);
  }
}
