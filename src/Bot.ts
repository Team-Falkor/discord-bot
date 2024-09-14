import { config } from "dotenv";
config();

import { ClientClass } from "./structure/Client";

export const client = new ClientClass();

(async () => {
  await client.init();
})();
