# HINESQ Complete System Flow - From Map Entry to Final Payout

## 1. Phase 1: Geo-Spatial Discovery (MAP → LEAD)
The journey begins on the interactive map ecosystem.
1. **Dynamic Generation**: Leads appear on the map as "NEW" status pins.
2. **Admin Insight**: Admin pans the map -> Selects a Lead pin -> Opens `LeadDetails`.
3. **Trigger**: Admin converts a "Lead" into an "Assignable Job".

## 2. Phase 2: Engagement & Assignment (LEAD → ASSIGNED)
1. **Assignment Logic**: 
   - **Auto-Assign**: Proximity, skills, and availability selection.
   - **Manual Assign**: Admin selects a specific worker.
2. **Worker Response**: Worker receives notification -> Views Details -> **Accepts or Rejects**.
   - **IF ACCEPTED**: Status shifts to "ACCEPTED" and the job joins the worker's agenda.
   - **IF REJECTED**: Lead returns to the pool.

## 3. Phase 3: Field Execution (JOB → EXECUTION)
1. **Arrival & Interaction**: Worker uses built-in directions to arrive.
2. **Real-time Updates**: Continuous Admin ↔ Worker ↔ Customer chat loop (Text, Image, Voice).
3. **Execution Milestone**: Worker marks "IN_PROGRESS" and performs work.

## 4. Phase 4: Financial Finalization (EXECUTION → QUOTE → CONTRACT)
1. **Field Quoting**: Initiated from the job site.
2. **Price Calculation Engine**:
   - **Formula**: `Final Price = (Material + Labor + Travel) + Profit Margin`.
   - **Pre-Inspection**: Measurement tool for scope auto-fill.
3. **Contract Phase**: Quote approval triggers a digital contract.
   - **Payment Split**: 15% Deposit | 50% Milestone | 35% Final.

## 5. Phase 5: Billing & Payouts (CONTRACT → INVOICE → PAYMENT)
1. **Invoicing**: System generates respective milestone invoices.
2. **Payment Tracking**: Confirmed via Stripe/ACH webhook.
3. **Logistics**: Job completion triggers an automated **Inventory Stock Update**.
4. **Final Payout**: Once final 35% is paid -> Funds added to `Worker Earnings`.

## 6. Support & Operational Flows
1. **Chat Flow**: Ongoing loop between Admin, Worker, and Customer.
2. **Automation Flow**: Standard triggers (e.g., Job Done -> follow-up email after 3 days).
3. **Issue Management**: Worker marks "Issue/Delayed" -> Admin alert -> Reschedule or Reassign.
4. **Growth**: Feature limits trigger the Subscription Upgrade flow (Gold/Elite/Platinum).
