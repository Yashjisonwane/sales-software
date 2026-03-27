# HINESQ Professional Development & Business Rules (v2.1)

## 1. UI & Responsiveness Standards (Frontend)

### 1.1 Device Adaptive Design
**Rule**: All headers and back-button areas **must** be wrapped in `useSafeAreaInsets`.
- **Header Pattern**: `insets.top + (base_padding)` (Handles notches and dynamic status bars).
- **Footer Pattern**: `insets.bottom` (Handles home indicators on modern devices).

### 1.2 Theming & Design Language
**Rule**: Standardized tokens from `src/constants/theme.js` are mandatory.
- **Strict Prohibition**: Hardcoded Hex codes or ad-hoc font families are forbidden.
- **Spatial Rhythm**: Align all spacing to the 4/8px grid using `SIZES.spacingX`.

### 1.3 Animation & Performance
**Rule**: Perform all layout-heavy animations (map zoom, sheet slides) using **Reanimated Shared Values**.
- **Constraint**: Never use standard `useState` for animating core layout properties to avoid 16ms frame drops.

## 2. Backend & System Architecture Rules (Full Stack)

### 2.1 Backend Pattern (MVC Strict)
**Rule**: Follow a strict Controller-Service-ORM pattern.
- **Prisma Only**: All database interactions must happen through Prisma.
- **Logic Isolation**: Business logic belongs in **Services**. Controllers should only handle input validation and response management.

### 2.2 Security Standards
- **Authentication**: Mandatory JWT-based session management for all non-public endpoints.
- **Role Middleware**: Every request must pass through role-specific permission checks (Admin vs Worker).

### 2.3 Naming Conventions
- **Database Architecture**: Use `snake_case` (e.g., `user_id`, `job_logs`).
- **Code & Logic**: Use `camelCase` (e.g., `setUserId`, `recentJobLogs`).

## 3. Core Business & Logic Rules (VERY IMPORTANT 🔥)

### 3.1 Role Permissions
- **Admin**: Full platform access (Inventory, Dashboard, Team, Subscriptions).
- **Worker**: Access limited strictly to **Assigned Jobs** and personal **Earnings**.

### 3.2 Pipeline Dependencies
- **Lead Assignment**: A lead must be formally assigned before a job is created.
- **Job Acceptance**: A worker must accept the job before a quote can be generated.
- **Quoting**: A valid quote is required before a digital contract can be triggered.
- **Workflow**: A contract MUST exist before any milestone invoice can be issued.

## 4. Release & DevOps Guidelines

### 4.1 Deployment (OTA Strategy)
**Rule**: Use `npm run update` (EAS) for UI, Assets, and JS logic fixes to ensure zero-delay delivery.
- **Threshold**: Rebuild binary (`npm run build:apk`) ONLY if `app.json` changes or new native modules are added.

### 4.2 Error Handling
- **User Feedback**: Every async failure must be caught with a `try/catch` and reported via a user-friendly UI component.
- **State Integrity**: Never mutate state directly; always use the spread operator `{...state}` or functional updates.

### 4.3 Versioning
- **Major**: Breaking changes.
- **Minor**: New features/screens.
- **Patch**: OTA-eligible fixes.
