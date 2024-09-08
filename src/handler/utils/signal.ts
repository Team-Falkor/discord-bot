export type HandlerEffectCallback = () => void;
export type HandlerSignalInitializer<T> = T | (() => T);
export type HandlerSignalUpdater<T> = T | ((prev: T) => T);
export type HandlerSignal<T> = readonly [
  () => T,
  (value: HandlerSignalUpdater<T>) => void,
  () => void
];

const context: HandlerEffectCallback[] = [];

/**
 * Creates a new signal.
 * @param value - The initial value to use.
 * @returns An array of functions: a getter, a setter, and a disposer.
 */
export function createSignal<T = unknown>(value?: HandlerSignalInitializer<T>) {
  const subscribers = new Set<() => void>();

  let disposed = false;
  let val: T | undefined = value instanceof Function ? value() : value;

  const getter = () => {
    if (!disposed) {
      const running = getCurrentObserver();
      if (running) subscribers.add(running);
    }

    return val;
  };

  const setter = (newValue: HandlerSignalUpdater<T>) => {
    if (disposed) return;
    val = newValue instanceof Function ? newValue(val!) : newValue;

    for (const subscriber of subscribers) {
      subscriber();
    }
  };

  const dispose = () => {
    subscribers.clear();
    disposed = true;
  };

  return [getter, setter, dispose] as HandlerSignal<T>;
}

/**
 * Creates a new effect.
 * @param callback - The callback function to execute.
 */
export function createEffect(callback: HandlerEffectCallback) {
  const execute = () => {
    context.push(execute);

    try {
      callback();
    } finally {
      context.pop();
    }
  };

  execute();
}

/**
 * Get the current observer.
 */
function getCurrentObserver() {
  return context[context.length - 1];
}
