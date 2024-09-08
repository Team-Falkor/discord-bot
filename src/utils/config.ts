import { Config } from "../@types";

let config: Config;

try {
  config = require("./config.json");
} catch (error) {
  config = {
    color: "#fbc531",
    music: {
      default_volume: 100,
      max_playlist_size: 100,
    },
  };
}

export { config };
