# 📏 SYSTEM RULES & VALIDATIONS: GEOMARKET INTEGRITY
### Business Intelligence, Data Constraints, & Security Standards

## 1. Core Philosophy: The Golden Rule
> **"Never trust the frontend — Always validate and sanitize on the backend."**
All business logic and data integrity must be strictly enforced at the Service and Repository layers regardless of UI-level guards.

---

## 2. Role-Based Access Control (RBAC)
The system operates on an absolute permission hierarchy based on the user's role.

### 🛡️ Admin Authority
*   **Permissions**: Full CRUD (Create, Read, Update, Delete) on Leads, Professionals, Jobs, Categories, Locations, and Subscription Plans.
*   **Visibility**: Complete operational oversight across all marketplace modules.

### 👨‍🔧 Professional Constraints
*   **Allowed**: View leads, Accept/Reject assigned leads, Communicate with customers via Chat, Update personal profile.
*   **Prohibited**: Manual lead creation, record deletion, infrastructure configuration (Cat/Loc), or access to global billing panels.

---

## 3. Entity Lifecycle Rules

### 📋 Lead Integrity
*   **Mandatory Attributes**: Customer Name, Service Category, Service Location, Valid Phone.
*   **State Locking**: Leads cannot be edited after reaching `COMPLETED` status.
*   **Exclusivity**: A single lead cannot be assigned to multiple professionals simultaneously.

### 🛠️ Job Scheduling
*   **Prerequisite**: A valid, existing `Lead` must be associated.
*   **Assignment**: A job cannot exist without an assigned `Professional` entity.
*   **Completion**: Status cannot transition to `COMPLETED` unless a professional is actively assigned.

### 👮 Professional Compliance
*   **Uniqueness**: Email addresses must be unique platform-wide (One Email = One Account).
*   **Suspension Block**: Suspended professionals are immediately restricted from accepting new leads or accessing active job details.
*   **Status Toggle**: Only `Active` professionals can transmit GPS telemetry for live tracking.

---

## 4. Infrastructure & Billing Constraints

### 🏷️ Categories & 📍 Locations
*   **Uniqueness**: Category names and City/State/Country combinations must be unique.
*   **Soft Deletion Safeguard**: Categories and Locations cannot be deleted if they are currently linked to active leads or professionals.

### 💳 Subscription Tiers
*   **Financial Integrity**: Plan prices must be greater than zero.
*   **Leads Cap**: Upon reaching the monthly leads limit (e.g., Starter = 10), the professional is blocked from further lead acquisitions until the next billing cycle or tier upgrade.

---

## 5. Engagement & Security Standards

### 💬 Chat & ⭐ Reviews
*   **Involvement**: Messaging is restricted strictly to the professional and the customer associated with a specific lead.
*   **Trust Trigger**: Reviews can only be submitted after a job has reached `COMPLETED` status.
*   **Rating Scale**: Ratings must strictly fall within the 1-5 integer scale.

### 🔐 System Security & Authentication
*   **Credential Integrity**: Both Email and Password are required for login.
*   **Email Protocol**: Must adhere to valid standard e-mail formatting.
*   **Password Depth**: Minimum threshold of 6 characters for all account identities.
*   **Role Logic**: Submission requires a selected role (Admin/Professional) to match against the target database record.
*   **JWT Integrity**: All protected API endpoints require a valid, non-expired JWT Bearer token.
*   **Role Enforcement**: Middleware must verify the token's role against the target endpoint's permission level.
*   **Telemetry**: GPS update intervals are capped at 15 seconds to optimize server resources.

---

## 🚨 6. Error Handling & Validation
| Status Code | Context | Requirement |
| :--- | :--- | :--- |
| **400 (Bad Request)** | Invalid input / Missing fields | Detailed validation message returned. |
| **401 (Unauthorized)**| Missing / Expired JWT | Token refresh or Login required. |
| **403 (Forbidden)**   | Role mismatch / Permission denied | Access restricted. |
| **404 (Not Found)**   | Missing entity | Standardized "Not Found" response. |
| **500 (Server Error)**| Backend exception | Error logged; generic message sent to client. |

---
*Verified Operational Rules: March 2026*
