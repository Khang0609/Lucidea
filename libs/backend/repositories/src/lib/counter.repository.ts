import { db } from '@lucidea/database';

export interface CounterRepository {
  get(username: string): Promise<number>;
  set(username: string, value: number): Promise<void>;
  migrate(oldUsername: string, newUsername: string): Promise<void>;
  delete(username: string): Promise<void>;
}

export class InMemoryCounterRepository implements CounterRepository {
  async get(username: string): Promise<number> {
    return db.getCounters().get(username) ?? 0;
  }

  async set(username: string, value: number): Promise<void> {
    db.getCounters().set(username, value);
  }

  async migrate(oldUsername: string, newUsername: string): Promise<void> {
    const value = await this.get(oldUsername);
    await this.set(newUsername, value);
    await this.delete(oldUsername);
  }

  async delete(username: string): Promise<void> {
    db.getCounters().delete(username);
  }
}
