# Database Schema Document - HINESQ Professional CRM Ecosystem

## 1. Relational Entity Design & Overview
The HINESQ database is a high-performance, geo-spatial schema built for audit trails and milestone-centric financial tracking.

---

## 2. Table Definitions (Core Schema)

### 2.1 Users (`users`)
Unique identifier for all platform participants.
| Field | Type | Description |
|---|---|---|
| `id` | UUID (PK) | Unique identifier |
| `name` | VARCHAR | Full legal name |
| `email` | VARCHAR (U) | Communication & Login |
| `pword_hash` | TEXT | Encrypted credentials |
| `role` | ENUM | 'ADMIN', 'WORKER' |
| `status` | VARCHAR | 'Active', 'Offline', 'Suspended' |
| `lat` / `lng` | FLOAT | Current location for proximity |
| `skills` | ARRAY[TEXT] | Specialized worker attributes |
| `avatar_url` | TEXT | Profile image CDN link |
| `is_verified` | BOOLEAN | OTP/Identity status |
| `company_id` | UUID (FK) | Reference for Admins |
| `created_at` | TIMESTAMP | Member since |

### 2.2 Companies (`companies`)
Business-level data for Admin roles.
| Field | Type | Description |
|---|---|---|
| `id` | UUID (PK) | Company ID |
| `business_name`| VARCHAR | Legal name |
| `tax_id` | VARCHAR | EIN/VAT for invoices |
| `logo_url` | TEXT | Branding |
| `base_currency`| VARCHAR | Default for quotes |
| `plan_tier` | ENUM | 'basic', 'gold', 'platinum' |

### 2.3 Leads (`leads`)
Geo-spatial job opportunities originating from map triggers.
| Field | Type | Description |
|---|---|---|
| `id` | UUID (PK) | Lead identifier |
| `address` | TEXT | Customer location |
| `lat` / `lng` | FLOAT | Map pin coordinates |
| `service_type` | VARCHAR | Category (e.g., HVAC) |
| `status` | ENUM | 'NEW', 'ASSIGNED', 'CONVERTED' |

### 2.4 Jobs (`jobs`)
Core operational entity converted from approved leads.
| Field | Type | Description |
|---|---|---|
| `id` | UUID (PK) | Job identifier |
| `lead_id` | UUID (FK) | Source lead reference |
| `assigned_to` | UUID (FK) | Worker User ID |
| `status` | ENUM | 'ACCEPTED', 'IN_PROGRESS', 'COMPLETED' |
| `scheduled_date`| TIMESTAMP | Planned start time |
| `description` | TEXT | Detailed scope notes |

### 2.5 Quoting System (`quotes`)
Dynamic pricing documents.
| Field | Type | Description |
|---|---|---|
| `id` | UUID (PK) | Quote identifier |
| `job_id` | UUID (FK) | Linked job |
| `material_cost` | DECIMAL | Total parts price |
| `labor_cost` | DECIMAL | Total service price |
| `travel_cost` | DECIMAL | Auto-calculated fuel fee |
| `subtotal` | DECIMAL | Pre-tax sum |
| `margin` | FLOAT | Profit margin (%) |
| `final_price` | DECIMAL | Customer facing total |

### 2.6 Contract System (`contracts`)
Digital agreements with milestone payment scheduling.
| Field | Type | Description |
|---|---|---|
| `id` | UUID (PK) | Contract identifier |
| `quote_id` | UUID (FK) | Source quote |
| `total` | DECIMAL | Overall value |
| `deposit_15` | DECIMAL | Upfront payment (15%) |
| `milestone_50` | DECIMAL | Progress payment (50%) |
| `final_35` | DECIMAL | Completion payment (35%) |

### 2.7 Financial Cluster (`invoices` & `payments`)
- **Invoices**: Tracks `id`, `contract_id`, `total_billed`, and `status` (DRAFT, SENT, PAID, OVERDUE).
- **Payments**: Detailed records: `id`, `invoice_id`, `amount`, `type`, `paid_at`.

---

## 3. Supporting Tables (Audit & Logistics)
- **Job Images**: Stores `id`, `job_id`, `image_url` for proof.
- **Job Logs**: Full audit trail of `status` changes and `timestamps`.
- **Inventory**: Material tracking (`id`, `item_name`, `quantity`, `status`).
- **Communications**: Real-time chat history (`id`, `sender_id`, `receiver_id`, `content`).

---

## 4. Advanced System Logic
- **Geo-Spatial Discovery**: Use PostGIS/Spatial Indices for fast map proximity queries.
- **Constraints**: 
  - Quote must precede Contract.
  - Contract must precede Invoice.
  - Proof of work required for Job status shift to "COMPLETED".
- **Indexing**: Composite indexing on `(lat, lng)` and `(assigned_to, status)`.
