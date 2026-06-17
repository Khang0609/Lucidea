import { Account } from '@lucidea/types';
import { db } from '@lucidea/database';

/**
 * AccountRepository interface defines the contract for account storage queries and commands.
 */
export interface AccountRepository {
  findByEmail(email: string): Promise<Account | null>;
  findByUsername(username: string): Promise<Account | null>;
  create(account: Account): Promise<Account>;
  delete(username: string): Promise<void>;
}

/**
 * InMemoryAccountRepository implements the AccountRepository contract using the InMemoryDatabase singleton.
 */
export class InMemoryAccountRepository implements AccountRepository {
  async findByEmail(email: string): Promise<Account | null> {
    for (const account of db.getAccounts().values()) {
      if (account.email && account.email.toLowerCase() === email.toLowerCase()) {
        return account;
      }
    }
    return null;
  }

  async findByUsername(username: string): Promise<Account | null> {
    for (const account of db.getAccounts().values()) {
      if (account.username.toLowerCase() === username.toLowerCase()) {
        return account;
      }
    }
    return null;
  }

  async create(account: Account): Promise<Account> {
    const key = account.username.toLowerCase();
    db.getAccounts().set(key, account);
    return account;
  }

  async delete(username: string): Promise<void> {
    const key = username.toLowerCase();
    db.getAccounts().delete(key);
  }
}
