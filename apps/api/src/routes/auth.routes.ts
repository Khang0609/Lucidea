import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { AuthService } from '../services/auth.service';
import { InMemoryAccountRepository, InMemoryCounterRepository } from '@lucidea/repositories';
import { authMiddleware, optionalAuthMiddleware } from '../middlewares/auth.middleware';

const authRoutes = Router();

// Instantiate dependency chain
const accountRepository = new InMemoryAccountRepository();
const counterRepository = new InMemoryCounterRepository();
const authService = new AuthService(accountRepository, counterRepository);
const authController = new AuthController(authService);

// Register routes
authRoutes.post('/register', optionalAuthMiddleware, authController.register);
authRoutes.post('/login', authController.login);
authRoutes.post('/anonymous', authController.anonymousLogin);
authRoutes.get('/me', authMiddleware, authController.me);

export default authRoutes;
