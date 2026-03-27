# HINESQ API Specification - Platform v1.1 Ecosystem

## 1. Request/Response Standards
- **Endpoint Pattern**: `/api/v1/{module}/{action}`
- **Common Response Skeleton**:
  ```json
  {
    "success": true,
    "status": 200,
    "data": { ... },
    "error": null
  }
  ```

---

## 2. Authentication & Identity Module
- `POST /auth/login`: Authenticate and return JWT token.
- `POST /auth/register`: Create a new Admin/Worker account.
- `GET /users/profile`: Sync current identity and permissions.
- `POST /users/push-token`: Register Expo push tokens for notifications.

---

## 3. Geo-Spatial Lead Engine (Map)
- `GET /leads`: Fetch markers for map display (with bounds filtering).
- `POST /leads`: Manually create a new lead marker.
- `GET /admin/stats`: Get dashboard metrics (Revenue, Active Workers, Growth).

---

## 4. Job & Assignment Operations
- `GET /jobs`: List all global jobs with filter support.
- `POST /jobs`: Convert an approved lead into a formal job.
- `PUT /jobs/:id/status`: Update status (ASSIGNED, ACCEPTED, IN_PROGRESS, COMPLETED).
- `POST /jobs/:id/assign-auto`: Proximity-based assignment trigger.
- `POST /jobs/:id/assign-manual`: Admin assigns specific `worker_id`.

---

## 5. Worker-Specific Workflows
- `GET /worker/board`: View available jobs based on profile skills.
- `GET /worker/jobs`: View all current worker-assigned jobs.
- `POST /worker/jobs/:id/accept`: Worker confirms job assignment.
- `POST /worker/jobs/:id/reject`: Worker refuses job with reason code.
- `POST /worker/jobs/:id/complete`: Submit images for proof of work.
- `POST /worker/payouts/request`: Request earnings transfer to bank.

---

## 6. Financial & Document Cluster
- `POST /quotes`: Multi-column quote generator (Material, Labor, Travel).
- `GET /quotes/:jobId`: Fetch quote data for a specific job.
- `POST /contracts`: Digital contract after quote approval.
- `POST /invoices`: Generate milestone-based invoice (15/50/35%).
- `GET /invoices/:id`: Fetch specific invoice details and status.
- `POST /payments`: Process transaction via Stripe/ACH webhook.

---

## 7. Communications & Operational Modules
- `GET /messages`: List chat threads.
- `POST /messages`: Send real-time messages to a recipient.
- `GET /inventory`: List business materials and stock levels.
- `POST /inventory`: Update stock or add items.

---

## 8. Error & Scenario Handling
- **401 Unauthorized**: Redirect to Login/Onboarding.
- **403 Forbidden**: Trigger upgrade modal for Gold/Platinum features.
- **429 Too Many Requests**: Rate-limiting for map telemetry data.
- **503 Service Unavailable**: Show offline-mode banner for local caching.
