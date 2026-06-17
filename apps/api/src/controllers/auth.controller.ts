import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { CreateAccountSchema } from '@lucidea/types';
import { z } from 'zod';

/**
 * Zod validation schema for Login request payload.
 */
export const LoginSchema = z.object({
  identity: z.string().min(1, { message: 'Username or email is required' }),
  password: z.string().min(1, { message: 'Password is required' }),
});

/**
 * AuthController manages requests for user authentication (register, login, me).
 */
export class AuthController {
  constructor(private authService: AuthService) {}

  /**
   * Registers a new account.
   */
  register = async (req: Request, res: Response) => {
    try {
      const parseResult = CreateAccountSchema.safeParse(req.body);
      if (!parseResult.success) {
        return res.status(400).json({
          message: 'Validation failed',
          errors: parseResult.error,
        });
      }

      const currentAnonUsername = req.user?.isAnonymous ? req.user.username : undefined;
      const migrateAnonData = !!parseResult.data.migrateAnonData;

      const result = await this.authService.register(
        parseResult.data,
        currentAnonUsername,
        migrateAnonData
      );
      return res.status(201).json(result);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An unknown error occurred';
      return res.status(400).json({ message });
    }
  };

  /**
   * Logs in a guest anonymously.
   */
  anonymousLogin = async (req: Request, res: Response) => {
    try {
      const result = await this.authService.registerAnonymous();
      return res.status(201).json(result);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An unknown error occurred';
      return res.status(400).json({ message });
    }
  };

  /**
   * Logs in an account and returns a JWT token.
   */
  login = async (req: Request, res: Response) => {
    try {
      const parseResult = LoginSchema.safeParse(req.body);
      if (!parseResult.success) {
        return res.status(400).json({
          message: 'Validation failed',
          errors: parseResult.error,
        });
      }

      const { identity, password } = parseResult.data;
      const result = await this.authService.login(identity, password);
      return res.status(200).json(result);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An unknown error occurred';
      return res.status(401).json({ message });
    }
  };

  /**
   * Returns authenticated user profile info.
   */
  me = async (req: Request, res: Response) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    return res.status(200).json({ user: req.user });
  };
}
