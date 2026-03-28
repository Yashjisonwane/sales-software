# HINESQ Platform: Full System Ecosystem & Triple-Connectivity Guide

This document defines the architecture and data relationship between the three main components of the HINESQ ecosystem: the **Sales Website**, the **Sales Software (Admin/Professional Dashboards)**, and the **Sales APK (Mobile App)**.

---

## 1. The Triple-Connectivity Model

The platform operates as a synchronized "Triple-Loop" where data flows seamlessly between the Customer, the Admin, and the Field Worker.

### 🌐 A. Sales Website (The Front Door)
*   **Target User:** Public / Potential Customers.
*   **Role:** Lead Generation.
*   **Flow:** 
    1.  Customer lands on the page.
    2.  Selects a service (e.g., Plumbing) and a Plan (Starter/Premium).
    3.  Drops a location pin and submits a **Service Request**.
*   **Output:** Creates a `Lead` record in the database with status `OPEN`.

### 💻 B. Sales Software (The Nerve Center)
*   **Target User:** Administrators and Web-based Professionals.
*   **Role:** Oversight, Management, and Strategic Assignment.
*   **Flow (Admin):**
    1.  Receives the `Lead` from the Website.
    2.  Qualified the lead and triggers **Assignment** (Manual or Auto-Assign based on radius).
    3.  Monitors the entire Job Workflow (Photos, Progress, Invoices).
*   **Flow (Pro Web):**
    1.  An alternative interface for Professionals to accept leads and manage jobs from a desktop.
*   **Output:** Converts a `Lead` into a `Job` and manages the platform lifecycle.

### 📱 C. Sales APK (The Field Tool)
*   **Target User:** Professionals / Field Workers.
*   **Role:** On-site Execution and Real-time Reporting.
*   **Flow:**
    1.  Worker receives a **Push Notification** for a new lead.
    2.  User uses the app for **GPS Navigation** to the site.
    3.  Enforces the **Strict Workflow**:
        *   **Photos:** Upload "Before" shots directly from the camera.
        *   **Inspection:** Digital checklist with customer signature on the screen.
        *   **Estimate:** Field quoting using the price calculation engine.
        *   **Completion:** Final "After" photos and **Invoice** generation.
*   **Output:** Real-time job completion data and financial records.

---

## 2. The Unified End-to-End Data Flow

| Stage | Origin | Actor | Data Action | Status Transition |
| :--- | :--- | :--- | :--- | :--- |
| **1. DISCOVERY** | Website | Customer | `POST /api/v1/leads` | `OPEN` |
| **2. ASSIGNMENT** | Admin Panel | Admin | `PATCH /api/v1/leads/:id/assign` | `ASSIGNED` ➔ `Job` Created |
| **3. ENGAGEMENT** | APK/Web Pro | Professional | `PATCH /api/v1/jobs/:id` | `SCHEDULED` ➔ `IN_PROGRESS` |
| **4. EXECUTION** | APK | Professional | `POST /api/v1/jobs/:id/photos` | Workflow Progress |
| **5. QUOTING** | APK | Professional | `POST /api/v1/jobs/:id/estimate` | `ESTIMATED` |
| **6. BILLING** | APK | Professional | `POST /api/v1/jobs/:id/invoice` | `INVOICED` |
| **7. PAYOUT** | Admin Panel | Admin | Financial Review | `COMPLETED` |

---

## 3. Core Logic & Constraints (For Backend Development)

1.  **Lead-to-Job Integrity:** A `Job` cannot exist without a corresponding `Lead`. The transition must be atomic.
2.  **Workflow Sequence Logic:** The backend MUST enforce the order: 
    `Photos` ➔ `Inspection` ➔ `Estimate` ➔ `Contract` ➔ `Invoice`. 
    *Example:* The API should reject an Estimate if no Inspection record exists for that Job.
3.  **Geo-Fencing:** The APK must periodically hit a `PATCH /users/location` endpoint to update the Admin's Map view.
4.  **Payment Split:** The billing engine should handle a 15%/50%/35% milestone split as defined in the business logic docs.

---

## 4. Connectivity Summary
The **Website** feeds the **Admin**, the **Admin** manages the **APK**, and the **APK** sends results back to the **Admin** for final settlement. 

Understanding this "Circle of Data" is the key to building a robust backend that supports all three platforms simultaneously.
