import { HandlerInteraction } from "../handlers/command/types";
import { getContext, prepareHookInvocationError } from "./common";

export function useInteraction<
  T extends HandlerInteraction = HandlerInteraction
>(): T {
  const data = getContext().getStore();

  if (!data) throw prepareHookInvocationError("useInteraction");

  return data.interaction as T;
}
