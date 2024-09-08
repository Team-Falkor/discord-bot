import { config } from "dotenv";
import { ClientClass } from "./structure/Client";
config();

export const client = new ClientClass();

(async () => {
  await client.init();
})();
