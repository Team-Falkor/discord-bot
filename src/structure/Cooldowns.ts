let instance: Cooldowns | null = null;

export class Cooldowns {
  private cooldowns: Map<string, number> = new Map();

  constructor() {
    if (!instance) instance = this;
    return instance;
  }

  set(id: string, time: number = 5000) {
    this.cooldowns.set(id, Date.now() + time);
  }

  get(id: string) {
    return this.cooldowns.get(id);
  }

  delete(id: string) {
    this.cooldowns.delete(id);
  }

  has(id: string) {
    return this.cooldowns.has(id);
  }

  check(id: string) {
    if (!this.has(id)) return false;
    const time = this.get(id);

    if (!time) return false;
    if (time > Date.now()) return true;

    this.delete(id);
    return false;
  }
}
