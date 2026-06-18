import { Account } from '@lucidea/types';
import * as fs from 'fs';
import * as path from 'path';

// Persistent database file in the workspace root
const DB_FILE = path.join(process.cwd(), 'database.json');

/**
 * A wrapper map that automatically triggers a callback on any mutations.
 */
class PersistentMap<K, V> extends Map<K, V> {
  constructor(private onMutation: () => void) {
    super();
  }

  override set(key: K, value: V): this {
    super.set(key, value);
    this.onMutation();
    return this;
  }

  override delete(key: K): boolean {
    const deleted = super.delete(key);
    if (deleted) {
      this.onMutation();
    }
    return deleted;
  }

  override clear(): void {
    super.clear();
    this.onMutation();
  }
}

/**
 * Persistent database singleton using JSON file storage.
 */
export class InMemoryDatabase {
  private static instance: InMemoryDatabase;
  private isSavingEnabled = true;

  private accounts = new PersistentMap<string, Account>(() => this.save());
  private counters = new PersistentMap<string, number>(() => this.save());

  private constructor() {
    this.load();
  }

  public static getInstance(): InMemoryDatabase {
    if (!InMemoryDatabase.instance) {
      InMemoryDatabase.instance = new InMemoryDatabase();
    }
    return InMemoryDatabase.instance;
  }

  /**
   * Loads the database from disk.
   */
  private load(): void {
    try {
      if (fs.existsSync(DB_FILE)) {
        const fileContent = fs.readFileSync(DB_FILE, 'utf8');
        const parsed = JSON.parse(fileContent);

        this.isSavingEnabled = false;

        this.accounts.clear();
        if (parsed.accounts) {
          for (const [k, v] of Object.entries(parsed.accounts)) {
            this.accounts.set(k, v as Account);
          }
        }

        this.counters.clear();
        if (parsed.counters) {
          for (const [k, v] of Object.entries(parsed.counters)) {
            this.counters.set(k, Number(v));
          }
        }

        this.isSavingEnabled = true;
        console.log(`[Database] Loaded state successfully from ${DB_FILE}`);
      }
    } catch (error) {
      console.error('[Database] Failed to load database file', error);
      this.isSavingEnabled = true;
    }
  }

  /**
   * Saves the database to disk.
   */
  private save(): void {
    if (!this.isSavingEnabled) return;
    try {
      const data = {
        accounts: Object.fromEntries(this.accounts),
        counters: Object.fromEntries(this.counters),
      };
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
    } catch (error) {
      console.error('[Database] Failed to save database file', error);
    }
  }

  /**
   * Returns the database collection of accounts.
   */
  public getAccounts(): Map<string, Account> {
    return this.accounts;
  }

  /**
   * Returns the database collection of counters.
   */
  public getCounters(): Map<string, number> {
    return this.counters;
  }

  /**
   * Clears all accounts and counters from the database.
   */
  public clear(): void {
    this.accounts.clear();
    this.counters.clear();
  }
}

export const db = InMemoryDatabase.getInstance();
