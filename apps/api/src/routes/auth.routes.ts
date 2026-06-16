import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { AuthService } from '../services/auth.service';
import { InMemoryAccountRepository } from '@lucidea/repositories';
import { authMiddleware } from '../middlewares/auth.middleware';

const authRoutes = Router();

// Instantiate dependecy chain
const accountRepository = new InMemoryAccountRepository();
const authService = new AuthService(accountRepository);
const authController = new AuthController(authService);

// Register routes
authRoutes.post('/register', authController.register);
authRoutes.post('/login', authController.login);
authRoutes.get('/me', authMiddleware, authController.me);

export default authRoutes;
