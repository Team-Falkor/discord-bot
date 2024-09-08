import type { Client } from "discord.js";
import { colors, Handler } from "../../handler";

export default function (
  c: Client<true>,
  client: Client<true>,
  handler: Handler
) {
  console.log(colors.green(`Logged in as ${c.user?.username}!`));
}
