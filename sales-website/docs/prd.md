# Project: HINESQ (Field Service Management)

## 📖 Project Overview
Hinesq is a comprehensive platform designed to bridge the gap between service business admins, field workers, and customers. It handles the entire lifecycle of a service request, from nearby job discovery to final invoicing and payment.

## 👥 User Roles & Capabilities

### 1. Admin (The Brain)
- **Approve Professionals**: Verify worker identity and skills.
- **Manage Leads & Categories**: Organize service requests and industry types.
- **Assignment**: Assign jobs (Auto/Manual) and track real-time progress.
- **Reports**: View platform-wide performance and financial metrics.

### 2. Professional / Worker (Field Execution)
- **Direct Marketplace**: Receive leads near their current map location.
- **Job Lifecycle**: Accept jobs and follow the 6-step workflow.
- **Business Management**: Manage profile, view accepted jobs, and document proof of work.

### 3. Customer (End User)
- **Discovery**: Search for services and view nearby professionals on the map.
- **Requests**: Submit service inquiries and see ratings/reviews.
- **Financials**: Sign digital contracts and pay for services.

## 📱 Platform Pages (Sitemap)
### Frontend Website
1. **Home**: Hero, Search, Popular Services, Map Preview, How it Works.
2. **Find Services**: Map View vs. Provider List (Name, Rating, Distance).
3. **Categories**: Plumbing, Electrical, Cleaning, HVAC, Roofing, Painting, etc.
4. **Request Service**: Form for Name, Phone, Address, Photos, and Date.
5. **Become Professional**: Registration for businesses/owners.
6. **Reviews & Login**: Community feedback and secure account access.

## 🛠️ Features List (MVP)
### 1. Sales & Growth
- **Smart Job Discovery**: Map-based visualization of nearby service requests.
- **Subscription Plans**: Pre-configured service plans (Starter $99, Premium $249).
- **Professional Leads Management**: Capturing and qualifying inquiries.

### 2. Operations & Execution
- **Job Flow Control (6 Steps)**:
  1. Schedule Job
  2. Documentation (Photos/Notes)
  3. Inspection Reports
  4. Estimate Generation
  5. Invoicing
  6. Job Closure
- **Smart Job Assignment**: Logic for assigning jobs based on worker skills and availability.
- **E-Contract Setup**: Digital signing and milestone-based payment schedules.

### 3. Reporting & Finance
- **Real-time Status Tracking**: Admin can see exactly which step a worker is on.
- **Automated Invoicing**: Generation of professional bills based on job data.

## 🧠 Business Logic
1. **Lead to Job Transition**: Once a lead is "Accepted/Assigned", it moves from the *Professional Leads* section to the *Jobs* section.
2. **Lead Distribution**: System detects 3-5 nearby professionals and sends leads based on proximity and rating.
3. **Sequential Workflow**: Workers cannot jump steps (e.g., they must complete Documentation before generating an Invoice).
4. **Plan-Driven UI**: Selecting the "Premium Care Plan" loads advanced inspection checklists and priority technician flags.
5. **Job Expiration**: Unresponsive job assignments move back to the unassigned pool after a set timer (1h, 6h, 24h).

## 🚀 Roadmap & Scope
### Beta Version (Current)
- Core lead capture & distribution.
- Map-based location tracking.
- Professional workflow & simple reporting.

### Future Features
- Real-time in-app Chat system.
- Push notifications for job status.
- Subscription-based premium plans for workers.
- Full PDF automated report generation.
