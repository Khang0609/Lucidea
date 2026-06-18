import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkeychangeinproduction';

// Extend Express Request interface globally
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: {
        username: string;
        email?: string;
        isAnonymous: boolean;
      };
    }
  }
}

/**
 * Middleware to authenticate requests by verifying JWT in the Authorization header.
 */
export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization token is required' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { username: string; email?: string; isAnonymous?: boolean };
    req.user = {
      username: decoded.username,
      email: decoded.email,
      isAnonymous: !!decoded.isAnonymous,
    };
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid or expired authorization token' });
  }
}

/**
 * Middleware to optionally authenticate requests by verifying JWT in the Authorization header if present.
 */
export function optionalAuthMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next();
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { username: string; email?: string; isAnonymous?: boolean };
    req.user = {
      username: decoded.username,
      email: decoded.email,
      isAnonymous: !!decoded.isAnonymous,
    };
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid or expired authorization token' });
  }
}
