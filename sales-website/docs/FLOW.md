# HINESQ Business Logic Flows

## 🔄 1. The Job Lifecycle (End-to-End)
1. **Selection**: User selects a **Service Plan** (Starter/Premium) on the landing page.
2. **Lead Creation**: Request captured in the **Professional Leads** section.
3. **Qualification**: Admin reviews the lead and marks it as **Qualified**.
4. **Assignment**: Admin assigns a **Worker** (Auto or Manual).
5. **Job Transition**: The lead is converted into an active **Job**.
6. **Execution (Worker Side)**:
   - Worker sees the job on their Mobile App/Hinesq Web.
   - **Step 1: Schedule Job**: Job appears in the calendar and sets the clock.
   - **Step 2: Documentation**: Photos (Before) and technical notes uploaded.
   - **Step 3: Inspection**: Detailed checklist submitted.
   - **Step 4: Estimate**: Worker creates a professional quote.
   - **Step 5: Invoice**: Final billing generated (Subtotal + Tax).
   - **Step 6: Done**: Worker clicks **Finish & Close**, setting status to **Finalized (100%)**.
7. **Final Settlement**: Admin reviews the job and payment is released.

---

## 📅 2. Smart Job Assignment Flow
1. **Trigger**: New Lead created.
2. **Auto-Assign**:
   - System searches for available workers within a **5-mile radius**.
   - Filters by **Category Match** (e.g., Electrician).
   - Assigns to the highest-rated available worker.
3. **Expiration Timer**:
   - Worker has the set time (1h, 6h, etc.) to **Accept**.
   - If timer expires → Job goes to the next best worker.
4. **Manual Assign**: Admin selects a specific worker from the list based on preference.

---

## 💰 3. Payment Split & E-Contract Flow
1. **Contract Setup**: Final price $X confirmed.
2. **Split Logic**:
   - 15% Deposit (Due Immediately)
   - 50% Milestone 1 (Upon Completion of Inspection)
   - 35% Final Payment (Upon Job Done)
3. **Submission**: Worker cannot finish the job until all payment statuses are updated.

---

## 🚫 4. Logic Constraints (Rules)
- **Status Integrity**: Status cannot skip steps (e.g., Cannot create Invoice without Documentation).
- **No Documentation skipping**: Inspection tab is locked until photos are uploaded.
- **Role Permissions**: Workers cannot edit Plan Base Prices created by the Admin.
- **Audit Requirement**: Every job closure must have at least 2 photos (Before/After).
