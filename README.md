# FINANCE.RDEV 🚀

<p align="left">
  <img src="https://img.shields.io/badge/Next.js_15-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Tailwind_CSS_v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" />
  <img src="https://img.shields.io/badge/shadcn/ui-000000?style=for-the-badge" />
  <img src="https://img.shields.io/badge/PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white" />
  <img src="https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white" />
  <img src="https://img.shields.io/badge/Recharts-FF6384?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" />
</p>

Personal finance management application with transaction categorization, financial dashboards, and PostgreSQL persistence

![Project Preview](https://i.imgur.com/6knbgSD.png)

## Introduction

FINANCE.RDEV is a personal finance management application built with Next.js, PostgreSQL, Prisma, and Tailwind CSS. The project focuses on transaction organization, automated categorization, financial dashboards, and data visualization through a modern fintech-style interface.

The application is designed for users searching for a Next.js finance tracker, personal expense manager, transaction categorization app, financial dashboard with PostgreSQL, or CSV-based budgeting platform.

## Technical Overview

The application uses Next.js 15 with the App Router architecture and TypeScript for typed frontend and server-side development. PostgreSQL is used as the primary database, managed through Prisma ORM and Docker-based local infrastructure.

The project follows a modular monolith architecture where business logic, UI components, and data processing services are separated by responsibility.

Current application capabilities include:
- CSV transaction import
- keyword-based automatic categorization
- manual category editing
- monthly financial filtering
- expense dashboards
- real-time transaction search
- financial chart rendering
- credit card invoice tracking
- toast-based notifications

The categorization engine is implemented as a rule-based processing layer using transaction description matching. Recharts is used for financial data visualization, including category distribution and monthly comparison charts.

## User Instructions

### Prerequisites

- Node.js v20 or higher
- Docker Desktop installed and running

### Installation

```bash
git clone https://github.com/your-user/finance-app.git
cd finance-app
npm install
```

### Start PostgreSQL with Docker

```bash
docker-compose up -d
```

### Environment configuration

Create a `.env` file in the project root:

```env
DATABASE_URL="postgresql://admin:password123@localhost:5432/finance_db?schema=public"
```

### Prisma setup

```bash
npx prisma generate
npx prisma db push
```

### Run locally

```bash
npm run dev
```

Open `http://localhost:3000/` in your browser.

## Developer Instructions

### Project structure

```bash
src/
├── app/          # Pages and Server Actions
├── components/   # UI and business components
├── lib/          # Prisma and utility configuration
├── services/     # Business logic and processing services
```

### Development server

```bash
npm run dev
```

### Production build

```bash
npm run build
```

### Start production server

```bash
npm run start
```

### Prisma Studio

```bash
npx prisma studio
```

### Development patterns

- App Router architecture
- Server Actions for backend operations
- Prisma ORM for database access
- Modular monolith structure
- Rule-based transaction categorization
- Tailwind utility-first styling
- Recharts for financial data visualization

### Contribution guidelines

- Create a feature branch from `main`
- Keep pull requests focused on one feature or fix
- Use descriptive commit messages
- Document schema changes in the PR description
- Validate financial calculations before opening a PR
- Include screenshots for dashboard or UI updates

Suggested branch names:

```bash
feature/credit-card-module
feature/open-banking
fix/category-engine
chore/readme-update
```

## Roadmap

- Transaction table pagination
- NextAuth/Auth.js authentication
- PDF report export
- Multi-currency support
- Open Banking API integration
- Recurring transaction support
- Budget and spending goals

## Support

[![Buy Me a Coffee](https://img.shields.io/badge/Buy_Me_a_Coffee-Support_Project-FFDD00?style=for-the-badge&logo=buymeacoffee&logoColor=black)]()
