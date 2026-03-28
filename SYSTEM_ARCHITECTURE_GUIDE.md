# Sales Software: System Architecture & Data Flow Guide

This document explains the connectivity between the **Admin Dashboard** and the **Professional Dashboard**, the lifecycle of a service request, and how data flows through the system.

---

## 1. Core Relationship: Admin vs. Professional

The system operates on a **Marketplace Model** where the Admin acts as the "Controller" and the Professional acts as the "Service Provider".

| Feature | Admin Role (The Controller) | Professional Role (The Worker) |
| :--- | :--- | :--- |
| **Visibility** | Sees ALL data across the entire platform. | Sees ONLY data assigned to them. |
| **Leads** | Can create, delete, and manually assign leads. | Receives lead invitations and can accept/reject them. |
| **Jobs** | Monitors job progress, photos, and financial statuses. | Executes the job workflow (Photos, Estimates, Invoices). |
| **People** | Manages professional profiles, status, and tracking. | Manages their own availability and location. |
| **Platform** | Configures categories, locations, and pricing plans. | Subscribes to plans to receive more leads. |

---

## 2. The Data Lifecycle (The "Lead-to-Job" Pipeline)

### Phase A: Lead Generation (The "Opportunity")
1.  **Creation:** A lead is created via the Public Website or manually by an **Admin**.
2.  **Status:** `OPEN` (Available for assignment).
3.  **Connectivity:** Admin sees this in **"Leads Management"**. Professionals in the area see this in **"Lead Explorer"**.

### Phase B: Assignment (The "Handshake")
1.  **Action:** Admin clicks "Assign Professional" OR a Professional clicks "Accept Lead".
2.  **Result:** 
    *   Lead status becomes `ASSIGNED`.
    *   A **Job record** is automatically created in the database.
3.  **Connectivity:** The Lead moves from the "Open" list to the Professional's **"My Jobs"** list.

### Phase C: Job Execution (The "Strict Workflow")
The Professional must follow a specific sequence inside their dashboard:
1.  **Start Trip:** Updates Job status to `IN_PROGRESS`.
2.  **Before Photos:** Captured via Professional App (`POST /jobs/:id/photos`).
3.  **Inspection:** Notes and customer signature (`POST /jobs/:id/inspection`).
4.  **Estimate:** Professional sets the price (`POST /jobs/:id/estimate`).
5.  **Execution & Completion:** Professional marks job done, uploads After Photos, and generates **Invoice** (`POST /jobs/:id/invoice`).

---

## 3. Dashboard Menu & API Mapping

### Admin Dashboard (Control Center)
| Menu | Purpose | Primary Data/API |
| :--- | :--- | :--- |
| **Dashboard** | KPI Overview (Revenue, Conversion). | `GET /leads/stats` |
| **Leads** | List of all requests. | `GET /leads` |
| **Jobs** | Real-time monitoring of work. | `GET /jobs` (All) |
| **Professionals** | Manage the workforce. | `GET /users/professionals` |
| **Categories** | Service types (Plumbing, etc). | `GET/POST /leads/categories` |
| **Subscriptions** | Billing and billing logs. | `GET /leads/subscriptions` |

### Professional Dashboard (Execution Portal)
| Menu | Purpose | Primary Data/API |
| :--- | :--- | :--- |
| **Dashboard** | Daily stats and map of today's tasks. | `GET /leads/stats` (Specific) |
| **Leads** | Browse and Accept new tasks. | `GET /leads` (Filtered for role) |
| **My Jobs** | Current active workflow. | `GET /jobs` (WorkerId filter) |
| **Map** | Visual tracking of assigned leads. | `GET /leads/locations` |
| **Profile** | Personal details and availability. | `PATCH /users/status` |
| **Subscription** | Current tier limits. | `GET /leads/subscriptions/active` |

---

## 4. Database Architecture (Prisma/MySQL)

The system uses **Prisma** with specific mapping (`@@map`) for database tables:

1.  **Users (`users`):** Unified table for Admins, Workers, and Customers. (Distinguished by `role`).
2.  **Leads (`leads`):** Stores the initial requirement/location.
3.  **Jobs (`jobs`):** The operational core. Links to a `Lead`, a `Customer`, and a `Worker`.
4.  **Workflow Details:** Separate tables for `job_photos`, `job_inspections`, `job_estimates`, and `job_invoices` (all linked to `job_id`).

---

## 5. Summary of Connectivity
The **Admin Dashboard** is where you build the "Marketplace" (add categories, approve professionals). The **Professional Dashboard** is where the actual revenue-generating "Work" happens. 

Data flows **forward** (Lead ➔ Assignment ➔ Job ➔ Invoice) and statuses flow **backward** (completion on professional app ➔ Status update on Admin dashboard).
