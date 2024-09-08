import { getHandler } from "./common";

export function useHandler() {
  const kit = getHandler();
  if (!kit) throw new Error("Handler is not initialized.");

  return kit;
}
