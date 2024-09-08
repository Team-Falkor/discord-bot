import { getFilePaths, toFileURL, clone, colors } from "../../utils";
import { ValidationHandlerData, ValidationHandlerOptions } from "./types";

/**
 * A handler for command validations.
 */
export class ValidationHandler {
  #data: ValidationHandlerData;

  constructor({ ...options }: ValidationHandlerOptions) {
    this.#data = {
      ...options,
      validations: [],
    };
  }

  async init() {
    this.#data.validations = await this.#buildValidations();
  }

  async #buildValidations() {
    const allowedExtensions = /\.(js|mjs|cjs|ts)$/i;

    const validationPaths = await getFilePaths(
      this.#data.validationsPath,
      true
    );
    const validationFilePaths = validationPaths.filter((path) =>
      allowedExtensions.test(path)
    );

    const validationFunctions: Function[] = [];

    for (const validationFilePath of validationFilePaths) {
      const modulePath = toFileURL(validationFilePath);

      let importedFunction = (await import(validationFilePath)).default;
      let validationFunction = clone(importedFunction);

      // If it's CommonJS, invalidate the import cache
      if (typeof module !== "undefined" && typeof require !== "undefined") {
        delete require.cache[require.resolve(validationFilePath)];
      }

      if (validationFunction?.default) {
        validationFunction = validationFunction.default;
      }

      const compactFilePath =
        validationFilePath.split(process.cwd())[1] || validationFilePath;

      if (typeof validationFunction !== "function") {
        process.emitWarning(
          colors.yellow(
            `Ignoring: Validation file ${compactFilePath} does not export a function.`
          )
        );
        continue;
      }

      validationFunctions.push(validationFunction);
    }

    return validationFunctions;
  }

  get validations() {
    return this.#data.validations;
  }

  async reloadValidations() {
    if (!this.#data.validationsPath) {
      throw new Error(
        colors.red(
          'Cannot reload validations as "validationsPath" was not provided when instantiating Handler.'
        )
      );
    }

    const newValidations = await this.#buildValidations();

    this.#data.validations = newValidations;
  }
}
