# Walkthrough - Authentication API with Three-Tier Architecture

We have successfully implemented a secure, modular three-tier authentication API in the Express backend (`apps/api`) using Zod schema validations, Argon2 password hashing, and JWT authorization tokens.

## Changes Made

### 1. Core Database Layer (Tier 3 - Data Store)
- **[database.ts](file:///e:/lap_trinh/Project/Lucidea/libs/core/database/src/lib/database.ts)**: Implemented an in-memory database singleton (`InMemoryDatabase`) that stores accounts using a Map collection. Allows simulating queries and saves without an external DB.

### 2. Repository Layer (Tier 3 - Data Access)
- **[account.repository.ts](file:///e:/lap_trinh/Project/Lucidea/libs/backend/repositories/src/lib/account.repository.ts)**: Defined the `AccountRepository` contract and created an `InMemoryAccountRepository` implementation queryable by email, username, or insertion.
- **[index.ts](file:///e:/lap_trinh/Project/Lucidea/libs/backend/repositories/src/index.ts)**: Exported the repository symbols.

### 3. Business Service Layer (Tier 2 - Logic)
- **[auth.service.ts](file:///e:/lap_trinh/Project/Lucidea/apps/api/src/services/auth.service.ts)**: Orchestrates register/login operations. Hashes passwords using `argon2`, performs database constraints validation (duplicate check), and generates JSON Web Tokens (JWT) for secure authentication sessions.

### 4. Presentation / Router Layer (Tier 1 - Interface)
- **[auth.middleware.ts](file:///e:/lap_trinh/Project/Lucidea/apps/api/src/middlewares/auth.middleware.ts)**: JWT middleware that validates the `Authorization: Bearer <token>` header, decodes user credentials, and appends them to the Express Request (`req.user`).
- **[auth.controller.ts](file:///e:/lap_trinh/Project/Lucidea/apps/api/src/controllers/auth.controller.ts)**: Express controller handlers validating input bodies (`CreateAccountSchema`, `LoginSchema`), executing `AuthService`, and mapping results to corresponding HTTP responses.
- **[auth.routes.ts](file:///e:/lap_trinh/Project/Lucidea/apps/api/src/routes/auth.routes.ts)**: Exposes router paths:
  - `POST /api/auth/register` (Public)
  - `POST /api/auth/login` (Public)
  - `GET /api/auth/me` (Protected - via auth middleware)
- **[main.ts](file:///e:/lap_trinh/Project/Lucidea/apps/api/src/main.ts)**: Configured the JSON request body parser and registered the authentication router under `/api/auth`.

---

## Verification and Testing

### Automated Test Runs
We wrote comprehensive test specs covering repository queries and complete authentication flows:
1. **Repository Unit Tests** ([account.repository.spec.ts](file:///e:/lap_trinh/Project/Lucidea/libs/backend/repositories/src/lib/account.repository.spec.ts)): Passed successfully (`5 passed`).
2. **Service Unit Tests** ([auth.service.spec.ts](file:///e:/lap_trinh/Project/Lucidea/apps/api/src/services/auth.service.spec.ts)): Passed successfully (`7 passed` under Jest, validating registration, argon2, and login).

Test summary command execution:
```bash
npx nx test repositories
npx nx test api
```
All tests completed with 100% success rate.
