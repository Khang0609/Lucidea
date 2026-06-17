# Lucidea Web Authentication & Session Integration Log

This document details the design, structure, and execution log for the frontend Lucidea Authentication Page, standard/guest API integrations, session state architecture, and the containerized execution environment.

---

## 1. Split-Screen Layout & Design (Figma Mockups)

We implemented a highly responsive, pixel-perfect replication of the Lucidea Figma authentication screens:

* **Outer Container:** A centered, split-screen desktop card with rounded corners (`rounded-[28px]`), subtle borders (`border-[#EFE9D9]/40`), and drop-shadow styling.
* **Right-Side Mascot Panel:** A static warm-yellow panel (`bg-[#FEE180]`) containing the corporate mascot cat illustration holding a briefcase (`working_cat.png`). The background is decorated with scattered, faint golden paw prints (`fill-[#C49A1B] opacity-[0.08]`) placed at randomized rotations. This panel remains completely static during view changes to prevent layout shifts.
* **Left-Side Dynamic Form Panel:** A clean white panel containing the dynamic form content, decorated with subtle grey background paw prints (`fill-gray-300 opacity-[0.03]`).

### Custom UI Components
* **Button:** Supports primary (solid gold `#C49A1B` with hover states and active-click scaling) and secondary (outline border) variants. Features built-in SVG loading spinners.
* **Input:** Form inputs with rounded borders, warm gold/beige outline borders, gold focus states, and real-time React Hook Form error displays.
* **PawCheckbox:** A custom check box that replaces default browser inputs with an interactive paw print SVG. When clicked, the paw fills with gold and executes a micro-spring scale animation.

---

## 2. State Management & Single-Page URL State Pattern

To provide seamless view transitions, the entire authentication interface resides on a single route (`/auth`).
* **URL Routing:** The active view (Login vs Create Account) is controlled by URL query parameters (`?view=login` and `?view=signup`).
* **Next.js Server Component:** The entry point `apps/web/src/app/auth/page.tsx` reads `searchParams` on the server and passes down props to conditionally render either the `<LoginForm />` or `<SignUpForm />`.
* **State Updates:** Switching views triggers smooth URL pushes using Next.js `<Link>` components, avoiding browser reloads and maintaining client-side state.

---

## 3. Account & Guest API Integration

The frontend connects directly to the Express backend API (proxied via Next.js dev rewrites on `/api/*` to `http://localhost:3333/api/*`):

### Standard Credential Login
* **Endpoint:** `POST /api/auth/login`
* **Form Inputs:** Username or email, and password. Validated client-side with a Zod schema resolver.
* **Result:** Stores JWT session tokens in browser `localStorage`, updates the `AuthContext` provider, and redirects to the landing page.

### Anonymous Guest Sessions
* **Endpoint:** `POST /api/auth/anonymous`
* **Trigger:** Clicked via **Continue as Guest** button on the Login view.
* **Result:** The backend registers a `guest_xxxx` account in the database (with nullable passwords/emails) and returns a guest JWT token. The browser logs in, displaying a "Welcome back guest" greeting.

### Registration & Session Migration
* **Endpoint:** `POST /api/auth/register`
* **Flow:** If standard registration is triggered while a guest session is active, the frontend sends the guest token in the `Authorization` header and includes the `migrateAnonData` flag (true/false) in the registration payload.
* **Migration Handling:** The backend registers the standard user and automatically reassigns the guest user's temporary test data to the new username, before deleting the temporary guest account.

---

## 4. Folder Structure (Modular Architecture)

To maintain a clean and highly structured monorepo structure, all frontend files use relative imports internally and are divided into distinct layers:

```
apps/web/src/
├── context/
│   └── AuthContext.tsx        # Session state provider (caches token, fetches profile)
├── hooks/
│   ├── useAuth.ts             # Hook coordinating standard, anonymous, and migration logins
│   └── useCounter.ts          # Hook managing temporary test data operations (+/- calls)
├── components/
│   ├── auth/
│   │   ├── LoginForm.tsx      # Handles logins and anonymous sessions
│   │   └── SignUpForm.tsx     # Handles registrations and migration toggling
│   └── ui/
│       ├── Button.tsx         # Styled polymorphic button
│       ├── Input.tsx          # Validation-wrapped text input
│       └── PawCheckbox.tsx    # Paw-styled animated checkbox
└── app/
    ├── layout.tsx             # Setup Google Fonts (Outfit) and context encapsulation
    ├── page.tsx               # Root test destination dashboard page
    └── auth/
        └── page.tsx           # URL state search parameter entry point
```

---

## 5. Multi-Stage Docker Environment

A custom `Dockerfile` was created at the root of `apps/web/` to define container environments:
* **development Stage:** Runs standard live-reloading dev server (`npx nx dev web -H 0.0.0.0 -p 4200`) allowing hot-reloads during containerized developer runs.
* **build-runner Stage:** Performs a clean build (`npx nx build web --prod`) to compile Next.js production outputs.
* **production Stage:** An optimized, lightweight runner that copies output files and starts the Next.js server with `npx next start -p 4200`.

Additionally, we added a global **[docker-compose.yml](file:///e:/lap_trinh/Project/Lucidea/docker-compose.yml)** at the workspace root to:
* Spin up both the `api` and `web` projects under unified containers using `docker compose up --build`.
* Configure bind-mount volumes that bridge code modifications from your local host OS directly into the Alpine development environment (`/app`), triggering instant hot-reloads (live-watch mode).
* Include anonymous volumes for node_modules and target build outputs to keep guest container compilations isolated from the host machine configurations.

---

## 6. Verification and Testing

* **Backend Unit Tests:** Updated the test suites in `auth.service.spec.ts`. All 10 tests passed successfully, validating account creations, duplicate constraint checking, and temporary test value migrations.
* **Frontend Build compilation:** The Next.js compiler completed successfully with zero TypeScript compilation warnings or static generation failures.
