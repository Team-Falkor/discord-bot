import {
  CommandObject,
  HandlerData,
  HandlerOptions,
  ReloadOptions,
} from "./@types";
import { CommandHandler } from "./handlers/command";
import { ComponentHandler } from "./handlers/component";
import { EventHandler } from "./handlers/event";
import { ValidationHandler } from "./handlers/validation";
import { colors } from "./utils";

export class Handler {
  #data: HandlerData;
  static _instance: Handler | null = null;

  constructor(options: HandlerOptions) {
    if (!options.client) {
      throw new Error(
        colors.red('"client" is required when instantiating Handler.')
      );
    }

    if (options.validationsPath && !options.commandsPath) {
      throw new Error(
        colors.red('"commandsPath" is required when "validationsPath" is set.')
      );
    }

    this.#data = options;
    Handler._instance = this;

    this.#init();
  }

  /**
   * Get the client attached to this Handler instance.
   */
  get client() {
    return this.#data.client;
  }

  /**
   * Get command handler instance.
   */
  get commandHandler() {
    return this.#data.commandHandler;
  }

  /**
   * (Private) Initialize Handler.
   */
  async #init() {
    // <!-- Setup event handler -->
    if (this.#data.eventsPath) {
      const eventHandler = new EventHandler({
        client: this.#data.client,
        eventsPath: this.#data.eventsPath,
        HandlerInstance: this,
      });

      await eventHandler.init();

      this.#data.eventHandler = eventHandler;
    }

    // <!-- Setup validation handler -->
    if (this.#data.validationsPath) {
      const validationHandler = new ValidationHandler({
        validationsPath: this.#data.validationsPath,
      });

      await validationHandler.init();

      this.#data.validationHandler = validationHandler;
    }

    // <!-- Setup command handler -->
    if (this.#data.commandsPath) {
      const commandHandler = new CommandHandler({
        client: this.#data.client,
        commandsPath: this.#data.commandsPath,
        devGuildIds: this.#data.devGuildIds || [],
        devUserIds: this.#data.devUserIds || [],
        devRoleIds: this.#data.devRoleIds || [],
        validationHandler: this.#data.validationHandler,
        skipBuiltInValidations: this.#data.skipBuiltInValidations || false,
        HandlerInstance: this,
        bulkRegister: this.#data.bulkRegister || false,
        enableHooks: this.#data.experimental?.hooks ?? false,
      });

      await commandHandler.init();
      this.#data.commandHandler = commandHandler;
    }

    // <!-- Setup components handler -->
    if (this.#data.componentsPath) {
      const componentsHandler = new ComponentHandler({
        client: this.#data.client,
        componentsPath: this.#data.componentsPath,
      });

      await componentsHandler.init();
      this.#data.componentsHandler = componentsHandler;
    }
  }

  /**
   * Updates application commands with the latest from "commandsPath".
   */
  async reloadCommands(type?: ReloadOptions) {
    if (!this.#data.commandHandler) return;
    await this.#data.commandHandler.reloadCommands(type);
  }

  /**
   * Updates application events with the latest from "eventsPath".
   */
  async reloadEvents() {
    if (!this.#data.eventHandler) return;
    await this.#data.eventHandler.reloadEvents(this.#data.commandHandler);
  }

  /**
   * Updates application command validations with the latest from "validationsPath".
   */
  async reloadValidations() {
    if (!this.#data.validationHandler) return;
    await this.#data.validationHandler.reloadValidations();
  }

  /**
   * @returns An array of objects of all the commands that Handler is handling.
   */
  get commands(): CommandObject[] {
    if (!this.#data.commandHandler) {
      return [];
    }

    const commands = this.#data.commandHandler.commands.map((cmd) => {
      const { run, autocomplete, ...command } = cmd;
      return command;
    });

    return commands;
  }

  /**
   * @returns The path to the commands folder which was set when instantiating Handler.
   */
  get commandsPath(): string | undefined {
    return this.#data.commandsPath;
  }

  /**
   * @returns The path to the events folder which was set when instantiating Handler.
   */
  get eventsPath(): string | undefined {
    return this.#data.eventsPath;
  }

  /**
   * @returns The path to the validations folder which was set when instantiating Handler.
   */
  get validationsPath(): string | undefined {
    return this.#data.validationsPath;
  }

  /**
   * @returns An array of all the developer user IDs which was set when instantiating Handler.
   */
  get devUserIds(): string[] {
    return this.#data.devUserIds || [];
  }

  /**
   * @returns An array of all the developer guild IDs which was set when instantiating Handler.
   */
  get devGuildIds(): string[] {
    return this.#data.devGuildIds || [];
  }

  /**
   * @returns An array of all the developer role IDs which was set when instantiating Handler.
   */
  get devRoleIds(): string[] {
    return this.#data.devRoleIds || [];
  }
}
