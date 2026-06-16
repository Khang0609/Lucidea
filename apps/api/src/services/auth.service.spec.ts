import { AuthService } from './auth.service';
import { InMemoryAccountRepository } from '@lucidea/repositories';
import { db } from '@lucidea/database';
import * as argon2 from 'argon2';

describe('AuthService', () => {
  let authService: AuthService;
  let repository: InMemoryAccountRepository;

  beforeEach(() => {
    db.clear();
    repository = new InMemoryAccountRepository();
    authService = new AuthService(repository);
  });

  const validRegistration = {
    username: 'valid_user',
    email: 'valid@example.com',
    password: 'SecurePassword123!',
  };

  it('should register a new user successfully and hash password', async () => {
    const result = await authService.register(validRegistration);
    expect(result.account.username).toBe(validRegistration.username);
    expect(result.account.email).toBe(validRegistration.email);
    expect(result.token).toBeDefined();

    // Verify stored account password is password-hashed
    const stored = await repository.findByUsername(validRegistration.username);
    expect(stored).not.toBeNull();
    if (stored) {
      expect(stored.password).not.toBe(validRegistration.password);
      expect(await argon2.verify(stored.password, validRegistration.password)).toBe(true);
    }
  });

  it('should throw an error if registering with duplicate email', async () => {
    await authService.register(validRegistration);
    await expect(authService.register({
      username: 'another_user',
      email: validRegistration.email,
      password: 'AnotherPassword123!',
    })).rejects.toThrow('Email is already registered');
  });

  it('should throw an error if registering with duplicate username', async () => {
    await authService.register(validRegistration);
    await expect(authService.register({
      username: validRegistration.username,
      email: 'another@example.com',
      password: 'AnotherPassword123!',
    })).rejects.toThrow('Username is already taken');
  });

  it('should authenticate user on successful login by email', async () => {
    await authService.register(validRegistration);
    const result = await authService.login(validRegistration.email, validRegistration.password);
    expect(result.account.username).toBe(validRegistration.username);
    expect(result.token).toBeDefined();
  });

  it('should authenticate user on successful login by username', async () => {
    await authService.register(validRegistration);
    const result = await authService.login(validRegistration.username, validRegistration.password);
    expect(result.account.email).toBe(validRegistration.email);
    expect(result.token).toBeDefined();
  });

  it('should throw an error on login with incorrect password', async () => {
    await authService.register(validRegistration);
    await expect(authService.login(validRegistration.username, 'WrongPassword123!'))
      .rejects.toThrow('Invalid username/email or password');
  });

  it('should throw an error on login with non-existent user', async () => {
    await expect(authService.login('nonexistent', 'SomePassword123!'))
      .rejects.toThrow('Invalid username/email or password');
  });
});
