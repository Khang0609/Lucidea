import { Account } from '@lucidea/types';

/**
 * In-Memory database singleton to store and manage accounts during runtime.
 */
export class InMemoryDatabase {
  private static instance: InMemoryDatabase;
  private accounts = new Map<string, Account>();

  private constructor() {
    // Private constructor enforces the Singleton pattern
  }

  public static getInstance(): InMemoryDatabase {
    if (!InMemoryDatabase.instance) {
      InMemoryDatabase.instance = new InMemoryDatabase();
    }
    return InMemoryDatabase.instance;
  }

  /**
   * Returns the database collection of accounts.
   */
  public getAccounts(): Map<string, Account> {
    return this.accounts;
  }

  /**
   * Clears all accounts from the database (useful for testing).
   */
  public clear(): void {
    this.accounts.clear();
  }
}

export const db = InMemoryDatabase.getInstance();
