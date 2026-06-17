import { AuthService } from './auth.service';
import { InMemoryAccountRepository, InMemoryCounterRepository } from '@lucidea/repositories';
import { db } from '@lucidea/database';
import * as argon2 from 'argon2';

describe('AuthService', () => {
  let authService: AuthService;
  let repository: InMemoryAccountRepository;
  let counterRepository: InMemoryCounterRepository;

  beforeEach(() => {
    db.clear();
    repository = new InMemoryAccountRepository();
    counterRepository = new InMemoryCounterRepository();
    authService = new AuthService(repository, counterRepository);
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
      expect(stored.password).not.toBeNull();
      if (stored.password) {
        expect(stored.password).not.toBe(validRegistration.password);
        expect(await argon2.verify(stored.password, validRegistration.password)).toBe(true);
      }
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

  describe('Anonymous Authentication & Migration', () => {
    it('should create an anonymous account successfully', async () => {
      const result = await authService.registerAnonymous();
      expect(result.account.username).toMatch(/^guest_/);
      expect(result.account.isAnonymous).toBe(true);
      expect(result.token).toBeDefined();

      const stored = await repository.findByUsername(result.account.username);
      expect(stored).not.toBeNull();
      expect(stored?.isAnonymous).toBe(true);
      expect(stored?.email).toBeNull();
      expect(stored?.password).toBeNull();
    });

    it('should migrate anonymous counter data if migrateAnonData is true', async () => {
      // 1. Create anonymous user
      const anonResult = await authService.registerAnonymous();
      const anonUsername = anonResult.account.username;

      // 2. Set anonymous counter
      await counterRepository.set(anonUsername, 5);

      // 3. Register standard user with migration
      const newUser = {
        username: 'migrated_user',
        email: 'migrated@example.com',
        password: 'SecurePassword123!',
      };

      const regResult = await authService.register(newUser, anonUsername, true);
      expect(regResult.account.username).toBe(newUser.username);

      // Verify anonymous account is deleted
      const storedAnon = await repository.findByUsername(anonUsername);
      expect(storedAnon).toBeNull();

      // Verify counter has been migrated
      const migratedValue = await counterRepository.get(newUser.username);
      expect(migratedValue).toBe(5);

      // Verify anonymous counter is deleted
      const oldVal = await counterRepository.get(anonUsername);
      expect(oldVal).toBe(0);
    });

    it('should delete anonymous counter data if migrateAnonData is false', async () => {
      // 1. Create anonymous user
      const anonResult = await authService.registerAnonymous();
      const anonUsername = anonResult.account.username;

      // 2. Set anonymous counter
      await counterRepository.set(anonUsername, 5);

      // 3. Register standard user without migration
      const newUser = {
        username: 'fresh_user',
        email: 'fresh@example.com',
        password: 'SecurePassword123!',
      };

      const regResult = await authService.register(newUser, anonUsername, false);
      expect(regResult.account.username).toBe(newUser.username);

      // Verify anonymous account is deleted
      const storedAnon = await repository.findByUsername(anonUsername);
      expect(storedAnon).toBeNull();

      // Verify new user has default counter (0)
      const newValue = await counterRepository.get(newUser.username);
      expect(newValue).toBe(0);

      // Verify anonymous counter is deleted
      const oldVal = await counterRepository.get(anonUsername);
      expect(oldVal).toBe(0);
    });
  });
});
