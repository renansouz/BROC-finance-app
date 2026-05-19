// src/app/(authenticated)/dashboard/page.tsx
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getFullDashboard } from "@/services/dashboard-service";
import { performUserOnboarding } from "@/services/onboarding";

// Componentes
import Header from "@/components/Header";
import MonthPicker from "@/components/MonthPicker";
import ActionModal from "@/components/ActionModal";
import SummaryCards from "@/components/SummaryCards";
import CreditCardsSection from "@/components/CreditCardsSection";
import AnalyticsSection from "@/components/AnalyticsSection";
import TransactionsSection from "@/components/TransactionsSection";
import ShareSummary from "@/components/ShareSummary";
import WealthSummary from "@/components/WealthSummary";
import EconomicIndicators from "@/components/EconomicIndicators";
import WealthSection from "@/components/WealthSection";
import PaymentTimeline from "@/components/PaymentTimeline";

export default async function DashboardPage({ searchParams }: { searchParams: Promise<any> }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const userId = session.user.id;
  const { month, year, q, limit } = await searchParams;

  const sMonth = parseInt(month || (new Date().getMonth() + 1).toString());
  const sYear = parseInt(year || new Date().getFullYear().toString());

  const data = await getFullDashboard(userId, sMonth, sYear, q);

  if (!data.settings?.isOnboardingComplete) {
    redirect("/setup");
  }

  await performUserOnboarding(userId);

  const currentLimit = parseInt(limit || "10");

  return (
    <div className="space-y-8 pb-10">
      <Header user={session.user} />
      
      <section className="flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-4 bg-card p-4 rounded-3xl border border-border shadow-sm">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          <MonthPicker />
          <div className="hidden sm:block w-px h-6 bg-border" />
          <ShareSummary 
             month={sMonth.toString().padStart(2, '0')}
             year={sYear.toString()}
             balance={data.finance.totalBalance}
             incomes={data.finance.totalIncomes}
             expenses={data.finance.totalExpenses}
             budgets={data.finance.budgetSummary}
          />
        </div>
        <ActionModal accounts={data.accounts} categories={data.categories} />
      </section>

      {(data.settings.hasInvestments || data.settings.hasVehicles || data.settings.hasRealEstate || data.settings.hasFGTS) && (
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
          <div className="lg:col-span-1 space-y-6">
            <WealthSummary totalWealth={data.wealth.totalWealth} totalYield={data.wealth.totalYield} />
            <EconomicIndicators indicators={data.indicators} />
          </div>
          <div className="lg:col-span-2">
            <WealthSection data={data.wealthEvolution} />
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-card rounded-2xl border border-border group hover:border-primary/30 transition-colors">
          <p className="text-[10px] text-zinc-500 font-black uppercase tracking-tighter">Liquidez Imediata</p>
          <p className="text-xl font-black text-emerald-400 mt-1">R$ {data.wealth.availableWealth.toLocaleString('pt-BR')}</p>
        </div>
        
        {data.settings.hasFGTS && (
          <div className="p-5 bg-card rounded-2xl border border-border group hover:border-blue-500/30 transition-colors">
            <p className="text-[10px] text-zinc-500 font-black uppercase tracking-tighter">Patrimônio Retido</p>
            <p className="text-xl font-black text-blue-400 mt-1">R$ {data.wealth.longTermWealth.toLocaleString('pt-BR')}</p>
          </div>
        )}

        <div className="p-5 bg-card rounded-2xl border border-border">
          <p className="text-[10px] text-zinc-500 font-black uppercase tracking-tighter">Ativos Brutos</p>
          <p className="text-xl font-black text-zinc-200 mt-1">R$ {data.wealth.assetsTotal.toLocaleString('pt-BR')}</p>
        </div>
        
        <div className="p-5 bg-card rounded-2xl border border-border">
          <p className="text-[10px] text-zinc-500 font-black uppercase tracking-tighter">Dívidas Totais</p>
          <p className="text-xl font-black text-rose-500 mt-1">- R$ {data.wealth.liabilitiesTotal.toLocaleString('pt-BR')}</p>
        </div>
      </div>

      <div className="space-y-6">
        <SummaryCards balance={data.finance.totalBalance} incomes={data.finance.totalIncomes} expenses={data.finance.totalExpenses} />

        <div className="grid gap-6 grid-cols-1 xl:grid-cols-2">
          <PaymentTimeline items={data.paymentItems} />
          <CreditCardsSection data={data.finance.creditCardsData} />
        </div>
      </div>
      <AnalyticsSection 
        evolutionData={data.evolutionData} 
        chartData={data.finance.chartData} 
        topExpenses={data.finance.topExpenses} 
      />

      <TransactionsSection 
        transactions={data.finance.transactions.slice(0, currentLimit)}
        totalTransactions={data.finance.transactions.length}
        currentLimit={currentLimit}
        categories={data.categories}
        month={sMonth.toString().padStart(2, '0')}
        year={sYear.toString()}
        q={q || ""}
      />
    </div>
  );
}