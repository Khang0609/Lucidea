import { AccountSchema, CreateAccountSchema, argon2HashRegex } from './account';

describe('Account Schema Validation', () => {
  describe('Argon2 Hash Regex', () => {
    it('should validate valid Argon2id hashes', () => {
      const validHash = '$argon2id$v=19$m=65536,t=3,p=4$c29tZXNhbHQ$c29tZWhhc2g';
      expect(argon2HashRegex.test(validHash)).toBe(true);
    });

    it('should validate valid Argon2i/Argon2d hashes', () => {
      const validArgon2i = '$argon2i$v=19$m=65536,t=3,p=4$c29tZXNhbHQ$c29tZWhhc2g';
      const validArgon2d = '$argon2d$v=19$m=65536,t=3,p=4$c29tZXNhbHQ$c29tZWhhc2g';
      expect(argon2HashRegex.test(validArgon2i)).toBe(true);
      expect(argon2HashRegex.test(validArgon2d)).toBe(true);
    });

    it('should reject invalid hashes', () => {
      const invalidHash = 'plainTextPassword123!';
      const partialHash = '$argon2id$v=19$m=65536';
      expect(argon2HashRegex.test(invalidHash)).toBe(false);
      expect(argon2HashRegex.test(partialHash)).toBe(false);
    });
  });

  describe('AccountSchema', () => {
    it('should parse valid Account object', () => {
      const validAccount = {
        username: 'john_doe',
        email: 'john.doe@example.com',
        password: '$argon2id$v=19$m=65536,t=3,p=4$c29tZXNhbHQ$c29tZWhhc2g',
      };
      const result = AccountSchema.safeParse(validAccount);
      expect(result.success).toBe(true);
    });

    it('should reject invalid username', () => {
      const invalidAccount = {
        username: 'jo', // too short
        email: 'john.doe@example.com',
        password: '$argon2id$v=19$m=65536,t=3,p=4$c29tZXNhbHQ$c29tZWhhc2g',
      };
      const result = AccountSchema.safeParse(invalidAccount);
      expect(result.success).toBe(false);
    });

    it('should reject invalid email', () => {
      const invalidAccount = {
        username: 'john_doe',
        email: 'invalid-email',
        password: '$argon2id$v=19$m=65536,t=3,p=4$c29tZXNhbHQ$c29tZWhhc2g',
      };
      const result = AccountSchema.safeParse(invalidAccount);
      expect(result.success).toBe(false);
    });

    it('should reject invalid Argon2 hash password', () => {
      const invalidAccount = {
        username: 'john_doe',
        email: 'john.doe@example.com',
        password: 'plainTextPassword123!',
      };
      const result = AccountSchema.safeParse(invalidAccount);
      expect(result.success).toBe(false);
    });
  });

  describe('CreateAccountSchema', () => {
    it('should accept secure plain text passwords', () => {
      const validCreate = {
        username: 'john_doe',
        email: 'john.doe@example.com',
        password: 'SecurePassword123!',
      };
      const result = CreateAccountSchema.safeParse(validCreate);
      expect(result.success).toBe(true);
    });

    it('should reject weak plain text passwords', () => {
      const weakPasswords = [
        'short',           // too short
        'NoSpecial123',     // missing special char
        'no_uppercase_1',   // missing uppercase
        'NO_LOWERCASE_1!',  // missing lowercase
        'NoNumbers!',       // missing numbers
      ];

      weakPasswords.forEach((password) => {
        const payload = {
          username: 'john_doe',
          email: 'john.doe@example.com',
          password,
        };
        const result = CreateAccountSchema.safeParse(payload);
        expect(result.success).toBe(false);
      });
    });
  });
});
