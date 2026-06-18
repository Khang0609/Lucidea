import { z } from 'zod';

/**
 * Regular expression to validate Argon2 hashes.
 * Matches standard Argon2 Modular Crypt Format (MCF).
 * Format: $argon2<type>$v=<version>$m=<memory>,t=<iterations>,p=<parallelism>$<salt>$<hash>
 * Example: $argon2id$v=19$m=65536,t=3,p=4$c29tZXNhbHQ$c29tZWhhc2g
 */
export const argon2HashRegex = /^\$argon2(d|i|id)\$v=\d+\$m=\d+,t=\d+,p=\d+\$[a-zA-Z0-9+/=]+(?:\$[a-zA-Z0-9+/=]+)?$/;

/**
 * Zod schema for validation of an Account.
 * Represents the account structure with a hashed password (Argon2).
 */
export const AccountSchema = z.object({
  username: z
    .string()
    .min(3, { message: 'Username must be at least 3 characters long' })
    .max(30, { message: 'Username cannot exceed 50 characters' })
    .regex(/^[a-zA-Z0-9_]+$/, {
      message: 'Username can only contain alphanumeric characters and underscores',
    }),
  email: z
    .email({ message: 'Invalid email address' })
    .optional()
    .nullable(),
  password: z
    .string()
    .regex(argon2HashRegex, { message: 'Password must be a valid Argon2 hash' })
    .optional()
    .nullable(),
  isAnonymous: z.boolean().default(false),
});

/**
 * TypeScript type inferred from AccountSchema.
 */
export type Account = z.infer<typeof AccountSchema>;

/**
 * Zod schema for creating an Account (takes plain text password and validates it).
 */
export const CreateAccountSchema = z.object({
  username: z
    .string()
    .min(3, { message: 'Username must be at least 3 characters long' })
    .max(30, { message: 'Username cannot exceed 30 characters' })
    .regex(/^[a-zA-Z0-9_]+$/, {
      message: 'Username can only contain alphanumeric characters and underscores',
    }),
  email: z.email({ message: 'Invalid email address' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long' })
    .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
    .regex(/[a-z]/, { message: 'Password must contain at least one lowercase letter' })
    .regex(/[0-9]/, { message: 'Password must contain at least one number' })
    .regex(/[^A-Za-z0-9]/, { message: 'Password must contain at least one special character' }),
  migrateAnonData: z.boolean().optional(),
});

/**
 * TypeScript type inferred from CreateAccountSchema.
 */
export type CreateAccountInput = z.infer<typeof CreateAccountSchema>;
