import { CreateAccountInput, Account } from '@lucidea/types';
import { AccountRepository } from '@lucidea/repositories';
import * as argon2 from 'argon2';
import * as jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkeychangeinproduction';
const JWT_EXPIRES_IN = '24h';

/**
 * AuthService handles business logic for account authentication, password hashing, and token issuing.
 */
export class AuthService {
  constructor(private accountRepository: AccountRepository) {}

  /**
   * Registers a new user account, hashing the password and issuing a JWT token.
   */
  async register(input: CreateAccountInput): Promise<{ account: Omit<Account, 'password'>; token: string }> {
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
    };

    await this.accountRepository.create(accountPayload);

    const token = this.generateToken(accountPayload.username, accountPayload.email);

    return {
      account: {
        username: accountPayload.username,
        email: accountPayload.email,
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

    if (!account) {
      throw new Error('Invalid username/email or password');
    }

    const isPasswordValid = await argon2.verify(account.password, password);
    if (!isPasswordValid) {
      throw new Error('Invalid username/email or password');
    }

    const token = this.generateToken(account.username, account.email);

    return {
      account: {
        username: account.username,
        email: account.email,
      },
      token,
    };
  }

  /**
   * Helper to sign JWT tokens.
   */
  private generateToken(username: string, email: string): string {
    return jwt.sign({ username, email }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  }
}
