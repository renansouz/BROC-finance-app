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

A financial operating system designed for absolute clarity. BROC. unifies your cash flow, wealth evolution, and banking automation into a single, intelligent interface.

![Project Preview](https://i.imgur.com/0S99GsJ.png)

## Introduction

BROC. is built for those who demand more than just expense tracking. It is a high-performance engine that eliminates manual friction, transforming fragmented banking data into a unified source of truth. My goal is to provide a "Zero Click" experience where your financial intelligence grows as the system learns from your habits.

## Technical Overview

The platform is engineered with **Next.js 15 (App Router)** and follows a **Modular Monolith** architecture. It implements strict **Multi-tenancy** at the database level, ensuring complete data isolation and privacy for every user.

### Core Capabilities:

- **Intelligent Onboarding:** A multi-step setup wizard that tailors the entire dashboard based on user assets (Vehicles, Real Estate, FGTS) and preferred synchronization methods.
- **Universal Data Mapper:** A robust CSV/OFX importer powered by **PapaParse** with dynamic header detection, allowing any bank statement to be processed regardless of column order.
- **Learning Engine:** A rule-based system that "learns" naming preferences. Renaming a cryptic bank description once creates a permanent rule for all future imports.
- **Wealth Management 360°:** Real-time calculation of Net Worth by balancing liquid accounts, fixed-income investments, physical assets, and liabilities (loans/financing).
- **Automated Communication:** Integration with **n8n** and **Telegram Bot API** for proactive financial reporting and real-time wealth alerts.
- **Market Context:** Direct integration with the **Central Bank of Brazil (BCB)** API to track SELIC and IPCA indicators against portfolio performance.
- **Modern Sidebar Architecture:** Scalable navigation system designed for a multi-page SaaS experience, including dedicated views for Wealth, Transactions, and Settings.

## Developer Instructions

### Project Structure

```bash
src/
├── app/          # Routes, Pages, and Server Actions
├── components/   # UI Components (shadcn/ui + custom)
├── lib/          # Shared utilities (Prisma, Date Utils)
├── services/     # Business Logic (Finance, Wealth, Onboarding, Categorizer)
```

### Key Patterns

- **Services Orchestration:** Heavy logic and mathematical calculations are extracted from pages into specialized services (DashboardService, WealthService) for maximum maintainability.
- **Smart Empty States:** Context-aware guides that replace empty charts with actionable "Next Steps" based on the user's chosen sync method.
- **Responsive Stacking:** High-density data tables that transform into card-based layouts for a premium mobile experience.

## Roadmap

### Real-Time Automation

- [ ] **Email Notification Parsing:** Automated reading of Sofisa, Nubank, and BTG transaction emails via n8n to eliminate manual entry.
- [ ] **Mobile Push Integration:** Webhook listeners for Android/iOS notifications to capture "coffee-shop" style expenses instantly.
- [ ] **Open Finance Hybrid:** Integration with banking aggregators (Pluggy/Belvo) for real-time balance syncing.
- [ ] **Duplicate Detection 2.0:** Advanced metadata matching to ensure automated entries don't overlap with manual uploads.

### Deployment & Scaling

- [ ] **Production Infrastructure:** Deploying the ecosystem (Next.js + n8n + PostgreSQL) using Docker Compose in a production VPS.
- [ ] **Cloud Migration:** Transitioning local DB to high-availability providers (Neon/Supabase) and frontend to Vercel.

## Support

[![Buy Me a Coffee](https://img.shields.io/badge/Buy_Me_a_Coffee-Support_Project-FFDD00?style=for-the-badge&logo=buymeacoffee&logoColor=black)]()
