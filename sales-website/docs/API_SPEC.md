# HINESQ API Specification

## 📡 Base Endpoint
`http://localhost:5000/api/v1`

---

## 👥 Authentication APIs
- **POST /auth/login**: User login and JWT generation.
- **POST /auth/register**: Register new Admins or Workers.

---

## 💼 Professional Leads APIs
- **GET /leads**: Fetch all active leads for Admin.
- **POST /leads**: Submit new request (from Nearby discovery).
- **PUT /leads/:id/status**: Update lead to `Qualified` or `Rejected`.
- **POST /leads/:id/convert**: Create a Job record from a lead.

---

## 🛠️ Jobs & Workflow APIs
- **GET /jobs**: Fetch all active and past jobs.
- **GET /jobs/:id**: Detailed info for a specific job (Worker/Admin).
- **PUT /jobs/:id/assign**: Assign a worker and update set timer.
- **POST /jobs/:id/documentation**: Upload photos (Multipart/multer) & technical notes.
- **POST /jobs/:id/inspection**: Submit detailed checklists.
- **POST /jobs/:id/estimate**: Generate a professional quote.
- **POST /jobs/:id/invoice**: Final billing & payment status.
- **PATCH /jobs/:id/finalize**: Set progress to 100% and notify admin.

---

## 💎 Plans APIs
- **GET /plans**: Fetch available Starter/Premium plans.
- **POST /plans**: Admin creates/updates a pricing plan.

---

## 💰 Finance & Contracts APIs
- **POST /jobs/:id/contract**: Set up E-Contract and Milestone splits.
- **PUT /jobs/:id/payment**: Update deposit or final payment status.

---

## 📊 Analytics APIs
- **GET /admin/dashboard**: Aggregated metrics (Total Leads, Revenue, Active Techs).
