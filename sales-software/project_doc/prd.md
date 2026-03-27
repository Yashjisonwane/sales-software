# 📘 PRODUCT REQUIREMENT DOCUMENT (PRD)
## 🎯 Product Overview: Geo-Intelligence Lead Management System

**Project Vision**: An ultra-high-velocity platform designed for platform owners (Admins) and service providers (Professionals) to manage service leads, assign jobs with geo-spatial intelligence, and optimize marketplace density.

---

# 👥 USER ROLES & PERMISSIONS

### 1. 🛡️ Admin (Control Center)
*   **Operations**: Manage leads, assign jobs, and monitor platform performance.
*   **Resources**: Create/Manage Service Categories and Marketplace Locations.
*   **Personnel**: Full oversight of Registered Professionals and Status Control.
*   **Financials**: Subscription tier management and professional billing.

### 2. 👷 Professional (Service Provider)
*   **Engagement**: View service leads, accept/reject opportunities.
*   **Communication**: Direct chat system with customers.
*   **Growth**: Track personal conversion rates, reviews, and performance.
*   **Account**: Manage business profile, availability, and geo-tracking.

---

# 🔑 LOGIN INTERFACE (AUTHENTICATION)
The entry point of the platform features a high-end, role-aware authentication layers.

### 🔹 1. Role Selection (The Core Toggle)
*   **Interaction**: A premium toggle/switch to select between `ADMIN` and `PROFESSIONAL`.
*   **Logic**: Updates the system context and dynamic UI elements instantly.

### 🔹 2. Credential Geometry
*   **Email Field**: Label: `Email Address` | Placeholder: `pro@demo.com`.
*   **Password Field**: Label: `Password` | Placeholder: `••••••••` | Security: Masked by default.
*   **Forgot Password**: Clear redirect path to the `/forgot-password` workflow.

### 🔹 3. Intelligent Submission
*   **Dynamic CTA**: The submit button text updates based on selection:
    *   `Login as Admin`
    *   `Login as Professional`
*   **Validation**: Required fields, e-mail formatting, and minimum 6-character password depth.

---

# 📊 ADMIN CORE MODULES

## 🚀 1. Marketplace Dashboard
| Component | Metric / Feature |
| :--- | :--- |
| **Stats Grid** | Total Leads, Total Professionals, Leads Today, Conversion Rate. |
| **Weekly Activity** | Mon-Sun numerical intensity tracking for lead submission. |
| **Growth Analytics** | New Professionals (%), Completion Rate (%), Platform Usage (%), Retention (%). |

## 📋 2. Leads Management
*   **Add Lead (Form)**: Name, Service (Category), Location (City/State), Date (Preferred), Description.
*   **Table View**: Lead ID, Name, Service, Location, Status (`New`, `Assigned`, `Completed`), Date.
*   **Filters**: Real-time toggles for status-based lead density.
*   **Detailed Intake**: Full customer profile (Phone, Email, Service Description).

## 🛠️ 3. Job & Fleet Operations
*   **Job Creation**: Dedicated form for Service assignment including Assigned Professional, Schedule Time, and Service Location.
*   **Professional Management**: Full profile creation (Business Name, Category, Experience, Phone/Email, Location Stack).
*   **Personnel Status**: Simple `Active` ↔ `Suspended` toggle control.

## 🌍 4. System Infrastructure
*   **Service Categories**: Name, Description, Backend Data (Status, Total Providers Count).
*   **Location Hubs**: City, State, Country management with auto-calculated Lead/Pro density.
*   **Security Settings**: Admin User, Primary Contact e-mail, and Security Key (Password) management.

---

# 👨‍🔧 PROFESSIONAL CORE MODULES

## 📈 1. Performance Dashboard
*   **Operational Glance**: New Leads Today, Total Leads, Accepted Leads, Conversion Rate (%).
*   **State Control**: Online/Offline status switch with Live Tracking toggle.

## 📋 2. Lead Opportunity Hub
*   **Interaction**: Card-based view of available leads with absolute `Accept` or `Reject` actions.
*   **Details**: View customer location, category, and preferred timeline before acceptance.

## 💬 3. Engagement & Trust
*   **Chat System**: Integrated messaging platform for direct customer interaction.
*   **Reviews & Ratings**: Comprehensive list of customer feedback with aggregated star ratings.

## 💳 4. Growth & Billing
*   **Subscription Plans**: View current active plan details and available upgrade tiers (Starter/Pro/Premium).
*   **Profile Management**: Business identity settings, hourly rates, and service radius configurations.

---

# 🎨 DESIGN & TYPOGRAPHY STANDARDS

### A. Typography Hierarchy
*   **Main Headers**: 1.5rem (24px) / 700 Bold (`text-2xl font-bold`).
*   **Sub-Headers**: 1.125rem (18px) / 700 Bold (`text-lg font-bold`).
*   **Stat Values**: 1.125rem (18px) / 700 Bold (`text-lg font-bold`).
*   **Labels**: 10px / 800 ExtraBold / Wide Tracking (`text-[10px] font-black tracking-widest`).

### B. Layout Specifications
*   **Offset**: `0px` from Top/Left edges for maximum operational space.
*   **Geometry**: Standardized `rounded-[2rem]` for main modules and `rounded-xl` for utility components.
*   **Theme**: Pure white (`bg-white`) on subtle neutral slate (`bg-gray-50`) background.

---
*Document Version: 1.0.0 | Last Updated: March 2026*