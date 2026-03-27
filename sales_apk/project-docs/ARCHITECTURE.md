# HINESQ Full Stack Architecture - Sales & Job Management Pro

## 1. High-Level Technology Stack & Ecosystem
The HINESQ ecosystem consists of a high-performance cross-platform mobile frontend (Expo/React Native) and a robust, modular service-oriented backend (Node.js/Express).

### 1.1 Frontend (Mobile App)
- **Framework**: React Native (v0.83.2) with Expo (SDK 55).
- **Navigation**: React Navigation (Bottom Tabs + Stack).
- **Animations**: Reanimated 3 & Gesture Handler (High-fidelity).
- **Maps**: Hybrid WebView integration for custom "Silver-style" Google Maps rendering.
- **Responsiveness**: Dynamic safe area handling via `react-native-safe-area-context`.

### 1.2 Backend (API & Engine)
- **Runtime**: Node.js with Express.js.
- **ORM**: Prisma for type-safe database access.
- **Database**: MySQL or PostgreSQL.
- **Architecture**: Modular Service-Controller pattern.

---

## 2. System Modules & Workflows (Full Pipeline)
The entire platform is architected to support the fundamental service pipeline:
**Map → Lead → Quote → Approval → Job → Assignment → Worker → Execution → Invoice → Payment**

### 2.1 Core Backend Modules
- **Auth (Identity)**: JWT-based secure session management.
- **Users**: Multi-role participant handling.
- **Leads (Map Engine)**: Spatial triggers for job generation.
- **Jobs**: Operational entity management.
- **Assignment Engine**: Automatic (proximity/skills) or Manual (admin) worker logic.
- **Financial Cluster**: Quotes, Contracts, Invoices, and Payments.
- **Communication & Logistics**: Chat, Inventory, Payroll, and Automation.

---

## 3. Detailed Architecture (Frontend Layers)

### 3.1 Navigation Architecture (Navigation Tree)
- `RootStack`: Splash, Welcome, RoleSelect, and Auth flows.
- `AdminTabs`: 
  - **Explore (Main)**: WebView-based Google Maps ecosystem with `@gorhom/bottom-sheet` dashboard.
  - **Inbox**: Centralized messaging.
  - **Account**: Business profiles and settings.
  - **Sub-Stacks**: `QuoteFlow`, `JobManagement`, `Financials`.
- `WorkerTabs`: Proximity Discovery, Job-specific Chat, and Professional Account.

### 3.2 Technical Decisions
- **Hybrid View Rendering**: Google Maps integration via WebView for extreme styling flexibility.
- **Performance & Animations**: 60FPS transitions using Reanimated 3 and conflict-free gesture handling.
- **State Management**: Navigation-Driven State Model for efficient data passing.
- **Responsive Design System**: Centralized `useSafeAreaInsets` for notch/home-bar compliance.

---

## 4. Backend Architecture & Development Standards

### 4.1 Folder Structure
- `/routes`: Endpoint definitions (logic-free).
- `/controllers`: Request/Response handling ONLY.
- `/services`: ALL core business logic and database interactions.
- `/middleware`: Auth (JWT), Permissions, and Validation.
- `/utils`: Common helper functions and ORM initialization.

### 4.2 Engineering Rules
- **No logic in routes**: Maintain a clean entry point.
- **Prisma isolation**: All DB calls must go through the Service layer.
- **Single Point Theme Swapping**: All UI styles reference `src/constants/theme.js`.

---

## 5. Directory & File Organization
- `src/screens`: Role-specific logic (admin/, worker/, auth/).
- `src/components`: Atomized UI pieces (JobCard.js, StatCard.js, MenuItem.js).
- `src/navigation`: Unified routing engine.
- `src/constants`: Static design tokens and hardcoded mock data.
- `src/utils`: Reusable helper functions (date, currency, validation).
- `src/hooks`: Custom React hooks for location, intervals, and safe areas.
