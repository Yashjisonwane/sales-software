# 🔌 API SPECIFICATION: GEOMARKET ENGINE
### RESTful API Documentation & Authorization Standards

## 🌐 Base Environment
*   **Base URL**: `http://localhost:5000/api`
*   **Version**: `v1.0.0`
*   **Content-Type**: `application/json`

---

## 🔐 1. AUTH & IDENTITY MODULE
### 💳 Register Professional
`POST /auth/register`
*   **Body**: `{ "name": "John Doe", "email": "john@example.com", "password": "...", "role": "PROFESSIONAL" }`

### 🔑 User Login
`POST /auth/login`
*   **Body**: `{ "role": "ADMIN|PROFESSIONAL", "email": "john@example.com", "password": "..." }`
*   **Response**: `{ "success": true, "token": "JWT_TOKEN", "user": { "id": 1, "role": "ADMIN" } }`

### 👤 Identity Validation
`GET /auth/me`
*   **Header**: `Authorization: Bearer <TOKEN>`

---

## 📋 2. LEADS MANAGEMENT
### ➕ Create Lead (Admin)
`POST /leads`
*   **Body**: `{ "customerName": "Alice", "service": "Plumbing", "location": "Mumbai", "phone": "9999999999", "email": "alice@mail.com", "description": "Pipe leakage", "date": "2026-03-25" }`

### 🔍 Search & Filter Leads
`GET /leads?status=NEW&search=Alice`

### ✨ Selection Operations (Professional Only)
*   **Accept Lead**: `POST /leads/:id/accept`
*   **Reject Lead**: `POST /leads/:id/reject`

---

## 🛠️ 3. JOBS & FULFILLMENT
### 📐 Schedule New Job
`POST /jobs`
*   **Body**: `{ "leadId": 1, "professionalId": 2, "date": "2026-03-26", "time": "10:00 AM" }`

### 📄 Job Tracking
*   **List Jobs**: `GET /jobs`
*   **Get Single Job**: `GET /jobs/:id`

### 🔄 Status Transition
`PUT /jobs/:id/status`
*   **Body**: `{ "status": "COMPLETED" }`

---

## 👷 4. PROFESSIONAL FLEET
### 🔍 Fleet Inventory
`GET /professionals?status=Active&service=Plumbing`

### ✏️ Detailed Profile Control
*   **Update Profile**: `PUT /professionals/:id`
*   **Delete Record**: `DELETE /professionals/:id`

### 🛡️ Administrative Control
`PUT /professionals/:id/status`
*   **Body**: `{ "status": "Suspended" }`

---

## 🗂️ 5. INFRASTRUCTURE: CATEGORY & LOCATION
### 🏷️ Service Taxonomy
*   **Add Category**: `POST /categories`
*   **Update/Delete**: `PUT /categories/:id` | `DELETE /categories/:id`

### 📍 Marketplace Hubs
*   **Register Hub**: `POST /locations`
*   **Update/Delete**: `PUT /locations/:id` | `DELETE /locations/:id`

---

## 💳 6. BILLING & SUBSCRIPTIONS
### 📜 Subscription Catalog
*   **Manage Plans**: `POST /subscriptions/plans` | `GET /subscriptions/plans`

### 🧾 Professional Enrollment
`POST /subscriptions`
*   **Body**: `{ "professionalId": 1, "plan": "Pro", "amount": 79 }`

---

## 💬 7. ENGAGEMENT: CHAT & REVIEWS
### 🧵 Message Streams
*   **Retrieve History**: `GET /chat/:leadId`
*   **Send Message**: `POST /chat` | `Body: { "leadId": 1, "message": "..." }`

### ⭐ Trust Metrics
*   **View Ratings**: `GET /reviews/:professionalId`
*   **Submit Review**: `POST /reviews`

---

## 🔐 8. AUTHORIZATION MATRIX
| Operation | Role: ADMIN | Role: PROFESSIONAL |
| :--- | :---: | :---: |
| **Create/Edit Leads & Jobs** | ✅ | ❌ |
| **Manage Professionals** | ✅ | ❌ |
| **Infrastructure (Cat/Loc)** | ✅ | ❌ |
| **Accept/Reject Leads** | ❌ | ✅ |
| **Direct Customer Chat** | ❌ | ✅ |
| **View Assigned Leads** | ✅ | ✅ |

---

## 📦 9. RESPONSE ENVELOPES
### ✅ Standard Success
`{ "success": true, "data": { ... } }`

### ❌ Standard Error
`{ "success": false, "message": "Detailed error context" }`

---
*Verified API Standard: v1.0.0 | March 2026*
