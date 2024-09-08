import { useHandler } from "./useHandler";

export function useClient() {
  return useHandler().client;
}
