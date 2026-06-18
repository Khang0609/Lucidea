import { CreateAccountInput, Account } from '@lucidea/types';
import { AccountRepository, CounterRepository } from '@lucidea/repositories';
import * as argon2 from 'argon2';
import * as jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkeychangeinproduction';
const JWT_EXPIRES_IN = '24h';

/**
 * AuthService handles business logic for account authentication, password hashing, and token issuing.
 */
export class AuthService {
  constructor(
    private accountRepository: AccountRepository,
    private counterRepository: CounterRepository
  ) {}

  /**
   * Registers a new user account, hashing the password and issuing a JWT token.
   * Optionally migrates anonymous cart data and deletes the anonymous guest account.
   */
  async register(
    input: CreateAccountInput,
    currentAnonUsername?: string,
    migrateAnonData = false
  ): Promise<{ account: Omit<Account, 'password'>; token: string }> {
    const existingEmail = await this.accountRepository.findByEmail(input.email);
    if (existingEmail) {
      throw new Error('Email is already registered');
    }

    const existingUsername = await this.accountRepository.findByUsername(input.username);
    if (existingUsername) {
      throw new Error('Username is already taken');
    }

    // Hash password with Argon2
    const hashedPassword = await argon2.hash(input.password);

    const accountPayload: Account = {
      username: input.username,
      email: input.email,
      password: hashedPassword,
      isAnonymous: false,
    };

    await this.accountRepository.create(accountPayload);

    const token = this.generateToken(accountPayload.username, accountPayload.email || undefined, false);

    // Account migration and guest session cleanup
    if (currentAnonUsername) {
      if (migrateAnonData) {
        // Migrate counter to the new registered user
        await this.counterRepository.migrate(currentAnonUsername, input.username);
      } else {
        // Discard/delete counter for the anonymous user
        await this.counterRepository.delete(currentAnonUsername);
      }

      // Delete the anonymous account from database to clean up
      await this.accountRepository.delete(currentAnonUsername);
    }

    return {
      account: {
        username: accountPayload.username,
        email: accountPayload.email || undefined,
        isAnonymous: false,
      },
      token,
    };
  }

  /**
   * Registers a new anonymous guest session.
   */
  async registerAnonymous(): Promise<{ account: Omit<Account, 'password'>; token: string }> {
    let username = '';
    let exists = true;
    while (exists) {
      const randomSuffix = Math.random().toString(36).substring(2, 8);
      username = `guest_${randomSuffix}`;
      const existing = await this.accountRepository.findByUsername(username);
      if (!existing) {
        exists = false;
      }
    }

    const accountPayload: Account = {
      username,
      email: null,
      password: null,
      isAnonymous: true,
    };

    await this.accountRepository.create(accountPayload);

    const token = this.generateToken(accountPayload.username, undefined, true);

    return {
      account: {
        username: accountPayload.username,
        isAnonymous: true,
      },
      token,
    };
  }

  /**
   * Log in an existing user account using email or username, returning an account object and token.
   */
  async login(identity: string, password: string): Promise<{ account: Omit<Account, 'password'>; token: string }> {
    let account: Account | null = null;
    if (identity.includes('@')) {
      account = await this.accountRepository.findByEmail(identity);
    } else {
      account = await this.accountRepository.findByUsername(identity);
    }

    if (!account || account.isAnonymous) {
      throw new Error('Invalid username/email or password');
    }

    if (!account.password) {
      throw new Error('Invalid username/email or password');
    }

    const isPasswordValid = await argon2.verify(account.password, password);
    if (!isPasswordValid) {
      throw new Error('Invalid username/email or password');
    }

    const token = this.generateToken(account.username, account.email || undefined, false);

    return {
      account: {
        username: account.username,
        email: account.email || undefined,
        isAnonymous: false,
      },
      token,
    };
  }

  /**
   * Helper to sign JWT tokens.
   */
  private generateToken(username: string, email?: string, isAnonymous = false): string {
    return jwt.sign({ username, email, isAnonymous }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  }
}
