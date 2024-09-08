import { AsciiTable3 } from "ascii-table3";
import fs from "node:fs";
import path from "node:path";
import { ComponentHandlerOptions } from "../../@types";

var table = new AsciiTable3();
table.setHeading("Buttons", "Stats");

export class ComponentHandler {
  #data: ComponentHandlerOptions;

  constructor({ ...options }: ComponentHandlerOptions) {
    this.#data = options;
  }

  async init() {
    const allowedExtensions = /\.(js|mjs|cjs|ts)$/i;

    const componentFolders = fs.readdirSync(this.#data.componentsPath);

    for (const folder of componentFolders) {
      const folderPath = path.join(this.#data.componentsPath, folder);

      const componentFile = fs
        .readdirSync(folderPath)
        .filter((path) => allowedExtensions.test(path));

      switch (folder) {
        case "buttons":
          for (const file of componentFile) {
            const buttonPath = path.join(folderPath, file);
            const button = require(buttonPath);
            table.addRow(button.data.name, "✅");
            this.#data.client.buttons.set(button.data.name, button);
          }
          break;

        default:
          break;
      }
    }

    console.log(table.toString());
  }
}
