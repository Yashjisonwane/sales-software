# Project: HINESQ Field Service CRM (MAP BASED SYSTEM) - PRD

## 1. Executive Summary & Overview
The **HINESQ Field Service CRM** is a specialized, geo-based SaaS platform built for the service industry (Construction, HVAC, Plumbing, Flooring, etc.). It enables business owners to automate their sales pipeline—from initial map-based lead discovery to AI-assisted quoting and automated invoicing—while providing field workers with a streamlined interface for job fulfillment and earnings tracking.

**The Core Service Pipeline:**
MAP → LEAD → QUOTE → APPROVAL → JOB → EXECUTION → INVOICE → PAYMENT

### Automated Systems:
- Lead tracking (map-based)
- Job assignment (Auto/Manual)
- Quote generation & Pricing Engine
- Contract signing & Legal compliance
- Invoice & Payments (Milestone-based)
- Worker management & Payroll
- Inventory & Materials tracking

---

## 2. Target Personas & Roles

### 2.1 The Business Owner (Admin)
- **Pain Points**: Manual quoting, lack of real-time worker tracking, missed leads, and complex billing.
- **Goals**: Automate the lead-to-invoice pipeline, maintain high-profit margins through data-driven quotes, and manage a distributed workforce efficiently.
- **Key Actions**: View map leads, create & manage jobs, assign workers, create quotes, send contracts & invoices, monitor revenue & performance.

### 2.2 The Service Professional (Worker)
- **Pain Points**: Unclear job details, difficult navigation to sites, delayed payouts.
- **Goals**: Find consistent high-paying work, have all job info in one place, and get paid instantly upon job completion proof.
- **Key Actions**: View assigned jobs, Accept/Reject leads, perform jobs, create field quotes, track earnings.

---

## 3. Core Modules & Detailed Features

### 3.1 MAP SYSTEM (ENTRY POINT 🔥)
- All leads originate from the map visualizer.
- **Lead Visualizer**: Categorized pins (Hot Leads, Subcontract, Delayed, In-Progress) with color coding.
- **Smart Pins**: Interactive markers with detailed overlays.
- **Distance-Based Logic**: 
  - Worker assignment based on location, skills, and availability.
  - Automatic Travel cost calculation.
- **Weather Integration**: Localized weather widgets for planning.
- **Search & Filter**: Real-time search with Google Places suggestions and history.

### 3.2 LEAD SYSTEM
- Created directly from map interactions.
- **Status Lifecycle**: NEW → ASSIGNED → ACCEPTED → CONVERTED.

### 3.3 JOB SYSTEM
- Created after successful lead assignment/conversion.
- **Data Points**: Address, Images, Service Type, Customer Details.
- **Status Lifecycle**: ASSIGNED → ACCEPTED → IN_PROGRESS → COMPLETED.

### 3.4 ASSIGNMENT SYSTEM
- **Automatic**: Based on geography, skills, and real-time availability.
- **Manual**: Admin selects a specific worker from the management portal.

### 3.5 QUOTE SYSTEM (CORE MONEY ENGINE 💰)
- **Multi-Step Wizard**:
  1. Job Scope definition.
  2. Measurement (Pre-Inspection Tool).
  3. Materials + Labor calculation.
  4. Travel Cost auto-injection.
  5. Profit Margin adjustment (AI-Assisted).
- **Compliance**: Mandatory photo uploads for milestones.

### 3.6 CONTRACT SYSTEM
- Auto-created after quote approval.
- **Payment Schedule**: 15% Deposit | 50% Milestone | 35% Final.

### 3.7 INVOICE SYSTEM
- Generated following contract signing.
- **Components**: Taxes, Discounts, Travel charges.
- **Status**: PENDING → PAID → OVERDUE.

### 3.8 PAYMENT SYSTEM
- Card / Bank transfer support via Stripe/ACH.
- Milestone-based payout tracking.

### 3.9 CHAT SYSTEM
- Admin ↔ Worker ↔ Customer.
- **Media**: Text, Images, Voice notes.

### 3.10 AUTOMATION & NOTIFICATIONS
- Trigger-based emails and SMS (e.g., Job complete → follow-up after 3 days).
- Context-aware push notifications.

### 3.11 INVENTORY & MATERIALS
- Real-time tracking of used materials per job.
- Automatic stock alerts.

### 3.12 PAYROLL & TAX SYSTEM
- W-2 / 1099 tracking for workers.
- Automated earnings balance and payout management.

### 3.13 SUBSCRIPTION SYSTEM
- Plan Tiers: Basic, Pro, Elite, Platinum.
- **Benefits**: Priority jobs, faster payouts, feature gating for large teams.

---

## 4. User Interface, Experience & Non-Functional Requirements

### 4.1 UI/UX Standards
- **Responsiveness**: Platform-agnostic layout using `useSafeAreaInsets` for notches and home bars.
- **Theming**: Premium dark/light palette with custom Inter typography.
- **Micro-interactions**: High-performance Reanimated 3 feedback.

### 4.2 Performance & Reliability
- **Smoothness**: Map frames at 60fps; Native-feel bottom sheet transitions.
- **Security**: JWT-based auth; Secure storage for banking info.
- **Scalability**: Support for 500+ active worker pins via clustering.
- **Reliability**: Over-the-Air (OTA) updates for rapid JS/Asset fixes.

---

## 5. Critical Business Rules (VERY IMPORTANT 🔥)
- Lead must be assigned → before job.
- Job must be accepted → before quote.
- Quote must exist → before contract.
- Contract must exist → before invoice.
- Invoice drives all payments and financial reports.
