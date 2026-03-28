# Backend Analysis Report: HINESQ System Consistency

I have analyzed the `sales-backend` code against your project's data flow requirements. Here is the evaluation of what is **correct (Shi)** and what needs **improvement (Gaps)** to achieve a "proper working backend."

---

## ✅ 1. What is Correct (Shi)
1.  **Lead-to-Job Transition:** The logic in `assignLead` correctly moves the status from `OPEN` to `ASSIGNED` and creates a 1-to-1 `Job` record. This perfectly matches the documentation!
2.  **Role-Based Security:** You have implemented `protect` and `authorize` middlewares in the routes. This ensures that a Professional cannot delete an Admin's data, and vice versa.
3.  **Prisma Mapping:** Using `@@map` is correctly set up for MySQL compatibility, and your database schema handles the relationships between Users, Leads, and Jobs well.
4.  **Flexible Category Resolution:** The backend can resolve a category by both `id` and `name`, which is great for flexibility between different frontend inputs.

---

## ❌ 2. Critical Gaps (Missing Logic)

### A. Website Plan Selection Missing
*   **The Problem:** On the Website, users select a **Starter** or **Premium** plan. However, the `Lead` and `Job` models in the database **do not have a field** to store this choice.
*   **The Impact:** The Admin and Professional won't know which plan the customer paid for or requested.
*   **The Fix:** Add a `servicePlan` column to the `Lead` model in Prisma.

### B. Lack of Strict Workflow Enforcement
*   **The Problem:** Your `FLOW.md` says: *"No step can be skipped."* But the current backend APIs for Estimates and Invoices (`jobController.js`) do not check if previous steps (Photos/Inspection) are completed.
*   **The Impact:** A professional could technically skip the on-site inspection and jump straight to invoicing.
*   **The Fix:** Add validation logic in `jobController.js` to ensure a Job has at least one Photo and an Inspection record before allowing an Estimate to be created.

### C. Missing Payment Split Logic
*   **The Problem:** Your docs mention a **15% / 50% / 35%** payment split.
*   **The Impact:** The current `/invoice` API only takes a single `amount`. It doesn't handle milestones or deposits.
*   **The Fix:** Update the `JobInvoice` model and controller to support milestone-based payments and track the status of each split.

---

## 3. Data Flow Evaluation

| Stage | Frontend State | Backend Readiness | Status |
| :--- | :--- | :--- | :--- |
| **Lead Creation** | Website Form | `POST /api/v1/leads` | ✅ Ready |
| **Assignment** | Admin Dashboard | `PATCH /api/v1/leads/:id/assign` | ✅ Ready |
| **Photos** | Professional App | `POST /api/v1/jobs/:id/photos` | ✅ Ready |
| **Inspection** | Professional App | `POST /api/v1/jobs/:id/inspection` | ✅ Ready |
| **Quoting** | Professional App | `POST /api/v1/jobs/:id/estimate` | ⚠️ Needs Validation |
| **Invoicing** | Professional App | `POST /api/v1/jobs/:id/invoice` | ⚠️ Needs Splits |

---

## 4. My Final Verdict
Your backend is **70% correct (Shi)** for the core dashboard operations. To make it **100% proper**, you should focus on adding the **Service Plan mapping** and enforcing the **Workflow Sequence** in your controllers.

Would you like me to fix these gaps in the Prisma schema and Controllers for you?
