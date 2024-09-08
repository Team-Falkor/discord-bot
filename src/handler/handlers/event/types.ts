import type { Client } from "discord.js";
import type { Handler } from "../../Handler";

/**
 * Event handler options.
 */
export interface EventHandlerOptions {
  client: Client;
  eventsPath: string;
  HandlerInstance: Handler;
}

/**
 * Private event handler data.
 */
export interface EventHandlerData extends EventHandlerOptions {
  events: { name: string; functions: Function[] }[];
}
