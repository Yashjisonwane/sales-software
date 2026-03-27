# HINESQ Database Design (Hinesq_DB)

## 🗄️ Core Tables

### users
Table for Admins and Workers.
- `id` (PK, UUID)
- `name` (String)
- `email` (String, Unique)
- `password` (String)
- `role` (Enum: Admin, Worker)
- `created_at` (DateTime)

### leads
The "Professional Leads" from first contact.
- `id` (PK)
- `customer_name` (String)
- `email` (String)
- `address` (Text)
- `category` (String: Plumber, Electrician, etc.)
- `urgency` (Enum: High, Low)
- `status` (Enum: New, Qualified, Converted_to_Job, Rejected)

### plans
Service plans created from Admin Dashboard.
- `id` (PK)
- `name` (String: Starter, Premium)
- `base_price` (Decimal)
- `features` (JSON / Text)

### jobs
Active jobs assigned to workers.
- `id` (PK, Serial)
- `lead_id` (FK -> leads.id)
- `worker_id` (FK -> users.id, null if unassigned)
- `plan_id` (FK -> plans.id)
- `status` (Enum: Unassigned, Assigned, In_Progress, Finalized)
- `progress` (Int: 0-100)
- `contract_signed` (Boolean)

### job_documentation
The 6-step workflow reporting.
- `id` (PK)
- `job_id` (FK -> jobs.id)
- `photos` (JSON: Array of photo URLs)
- `tech_notes` (Text)
- `inspection_done` (Boolean)
- `inspection_results` (JSON)

### invoices
Final billing data.
- `id` (PK)
- `job_id` (FK -> jobs.id)
- `subtotal` (Decimal)
- `tax` (Decimal)
- `grand_total` (Decimal)
- `payment_status` (Enum: Unpaid, Deposit_Paid, Fully_Paid)

## 📌 Rules
1. **Naming**: Use `snake_case` for all table and column names.
2. **Persistence**: Never delete records; use a `is_deleted` or `deleted_at` flag for soft deletion.
3. **Relationships**: Always use Foreign Keys (`FK`) to maintain referential integrity.
4. **Prisma**: All tables MUST be defined in `schema.prisma` first.
