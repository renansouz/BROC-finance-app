# BROC. 🚀

<p align="left">
  <img src="https://img.shields.io/badge/Next.js_15-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Tailwind_CSS_v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" />
  <img src="https://img.shields.io/badge/Auth.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" />
  <img src="https://img.shields.io/badge/PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white" />
  <img src="https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white" />
  <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" />
  <img src="https://img.shields.io/badge/n8n_Ready-FF6C37?style=for-the-badge&logo=n8n&logoColor=white" />
</p>

Intelligent multi-user personal finance management system featuring automated learning, banking synchronization, and deep financial analytics.

![Project Preview](https://i.imgur.com/0S99GsJ.png)

## Introduction

BROC. is a high-performance financial engine designed to eliminate manual tracking. Built with a modern tech stack, it transforms raw banking data into actionable insights through a fintech-inspired interface.

The core philosophy of the project is **"Data-First"**: a robust architecture where accounts, transactions, and investments are unified into a single source of truth, enabling automated reporting, budgeting, and future planning.

## Technical Overview

The application is built on **Next.js 15 (App Router)** and follows a **Modular Monolith** architecture. It implements **Multi-tenancy (User Isolation)** at the database level, ensuring that each user has a private and secure environment.

### Core Capabilities (Implemented):

- **Multi-user Authentication:** Secure Google Login via Auth.js (NextAuth).
- **Intelligent Categorization:** A rule-based engine that "learns" from user behavior and automatically categorizes new transactions.
- **Advanced Dashboard:** Real-time analytics including Monthly Evolution, Category Distribution, and Top Expenses.
- **Credit Card Engine:** Specialized logic for billing cycles, closing/due dates, and limit tracking.
- **Automated Onboarding:** Intelligent seeding of default categories and accounts for new users.
- **Transaction Management:** CSV import, manual entry, real-time search, and server-side pagination.

## User Instructions

### Prerequisites

- Node.js v20+
- Docker Desktop
- Google Cloud Console Project (for Auth)

### Installation

```bash
git clone https://github.com/your-user/finance-app.git
cd finance-app
npm install
```

### Infrastructure & Database

```bash
docker-compose up -d
npx prisma generate
npx prisma migrate dev
```

### Environment Configuration

Create a `.env` file:

```env
DATABASE_URL="postgresql://admin:password123@localhost:5432/finance_db?schema=public"
AUTH_SECRET="your_nextauth_secret"
AUTH_GOOGLE_ID="your_google_client_id"
AUTH_GOOGLE_SECRET="your_google_client_secret"
```

### Run locally

```bash
npm run dev
```

## Developer Instructions

### Project Structure

```bash
src/
├── app/          # Routes, Pages, and Server Actions
├── components/   # UI Components (shadcn/ui + custom)
├── lib/          # Shared utilities (Prisma, Date Utils)
├── services/     # Business Logic (Finance, Evolution, Onboarding, Categorizer)
```

### Key Patterns

- **Services Layer:** All complex calculations (budgets, totals, charts) are isolated in services for better maintainability.
- **Prisma Adapters:** Used for seamless integration between Auth.js and PostgreSQL.
- **Responsive Stacking:** Tables that transform into interactive cards for mobile users.

## Roadmap

### Automation & Connectivity (Current Priority)

- [ ] **Open Finance Integration:** Direct connection with Sofisa Bank and others via API (Pluggy/Belvo).
- [ ] **n8n Automation:** Webhooks to receive real-time transaction alerts from banking partners.
- [ ] **Spending Goals (Budgets):** Visual progress bars for monthly category limits.

### Wealth Management

- [ ] **Investment Tracking:** Real-time B3 (Stocks/REITs) and Fixed Income (CDB/Tesouro) monitoring.
- [ ] **Economic Indicators:** Dashboard integration with IPCA, SELIC, and Ibovespa.
- [ ] **Asset Management:** Tracking physical goods (Real Estate, Vehicles) and FGTS.

### Intelligence

- [ ] **Predictive Analysis:** AI-powered spending projections for the next 3 months.
- [ ] **Automated Alerts:** WhatsApp/Telegram notifications via n8n for budget overruns.
- [ ] **PDF Executive Reports:** Monthly financial performance summaries.

## Support

[![Buy Me a Coffee](https://img.shields.io/badge/Buy_Me_a_Coffee-Support_Project-FFDD00?style=for-the-badge&logo=buymeacoffee&logoColor=black)]()
