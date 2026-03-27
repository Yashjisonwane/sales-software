# HINESQ Backend Architecture

## 🚀 Technology Stack
- **Runtime**: Node.js + Express
- **Framework**: MVC (Model-View-Controller)
- **Database**: MySQL (Host: phpMyAdmin/Local)
- **ORM**: Prisma (for type-safe database queries)
- **Language**: JavaScript / TypeScript

## 📂 Project Structure
```
/frontend (React)
  ├── src/
  │   ├── components/      (Navbar, ServiceCard, ProviderCard)
  │   ├── pages/           (Home, RequestService, JobDetails)
  │   └── App.jsx          (Routing)

/backend (Hinesq_API)
  ├── prisma/              (Schema)
  ├── src/
  │   ├── controllers/     (Entry)
  │   ├── services/        (Logic)
  │   ├── routes/          (URLs)
  │   └── app.ts           (Server)
```

## 🏗️ Architecture Rules
1. **Separation of Concerns**: 
   - No business logic in Routes (only call controllers).
   - No database queries in Controllers (call services).
   - All DB interactions MUST happen in **Services** only using Prisma.
2. **Controller Responsibilities**:
   - Extract data from request (`body`, `params`, `query`).
   - Validate input.
   - Send standardized JSON responses (Success/Error).
3. **Data Integrity**: 
   - All financial calculations (Invoice subtotals, tax) must be performed in the **Services** layer, not on the Frontend.
4. **Environment**: Use `.env` file for all database credentials and secret keys.
