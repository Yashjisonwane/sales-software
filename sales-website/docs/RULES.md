# HINESQ AI Control System: Rules for Antigravity

## 🤖 AI Execution Rules
1. **Consistency**: Follow the project docs (`PRD.md`, `ARCHITECTURE.md`, `DATABASE.md`) strictly for all new features.
2. **Code Safety**:
   - Do not overwrite existing frontend layout and colors without approval.
   - Do not delete operational functions (e.g., `completeStep`, `handleStepClick`).
3. **MVC Structure**:
   - All backend code must use the **Controller-Service-Route** structure.
   - All business logic (Pricing, Logic checks) must be in the **Services** layer.
4. **Prisma ORM**: All database interactions MUST be through Prisma only.
5. **No Placeholders**: 
   - Use `generate_image` or valid library icons (Lucide/Inter) instead of placeholders.
   - Ensure all mock data in the UI (Hinesq Logo, Job IDs) is professional.
6. **Error Handling**: Use `try/catch` and standardized error responses for all API endpoints.
7. **Async/Await**: Use `async/await` for all asynchronous operations.

## 🎨 UI/UX Styling Rules
1. **Font Family**: Always use **Inter** (weights 400 to 900).
2. **Colors**: Use the Hinesq brand (Black/White/Grey) with the brand purple (`#7C3AED`) as the only permitted accent.
3. **Responsive Design**: All new components must be mobile-friendly.
4. **Rounding**: Use `rounded-xl` or `rounded-2xl` for consistency.

## 📦 Dependency Management
1. **Libraries**: Only use `react-router-dom`, `lucide-react`, `tailwindcss`, and `framer-motion` (if needed) for the frontend.
2. **Backend Packages**: Use `express`, `prisma`, `jsonwebtoken`, `bcryptjs`, and `multer`.
