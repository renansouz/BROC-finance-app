import { auth } from "@/auth";
import ActionModal from "@/components/ActionModal";
import AnalyticsSection from "@/components/AnalyticsSection";
import CreditCardsSection from "@/components/CreditCardsSection";
import EconomicIndicators from "@/components/EconomicIndicators";
import Header from "@/components/Header";
import MonthPicker from "@/components/MonthPicker";
import PaymentTimeline from "@/components/PaymentTimeline";
import ShareSummary from "@/components/ShareSummary";
import SummaryCards from "@/components/SummaryCards";
import TransactionsSection from "@/components/TransactionsSection";
import WealthSection from "@/components/WealthSection";
import WealthSummary from "@/components/WealthSummary";
import { getFullDashboard } from "@/services/dashboard-service";
import { redirect } from "next/navigation";

export default async function Home({ searchParams }: { searchParams: Promise<any> }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { month, year, q, limit } = await searchParams;
  const currentLimit = parseInt(limit || "10");
  const sMonth = parseInt(month || (new Date().getMonth() + 1).toString());
  const sYear = parseInt(year || new Date().getFullYear().toString());

  const data = await getFullDashboard(session.user.id, sMonth, sYear, q);

  return (
    <div className="min-h-screen bg-[#09090b] text-white p-4 md:p-10 space-y-10 font-sans">
      <Header />

      <section className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white/2 p-4 rounded-2xl border border-white/5">
        <div className="flex items-center gap-4">
          <MonthPicker />
          <ShareSummary 
             month={sMonth.toString()} year={sYear.toString()}
             balance={data.finance.totalBalance} incomes={data.finance.totalIncomes} 
             expenses={data.finance.totalExpenses} budgets={data.finance.budgetSummary} 
          />
        </div>
        <ActionModal accounts={data.accounts} categories={data.categories} />
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6">
          <WealthSummary totalWealth={data.wealth.totalWealth} totalYield={data.wealth.totalYield} />
          <EconomicIndicators indicators={data.indicators} />
        </div>
        <WealthSection data={data.wealthEvolution} />
      </div>

      <SummaryCards 
        balance={data.finance.totalBalance} 
        incomes={data.finance.totalIncomes} 
        expenses={data.finance.totalExpenses} 
      />

      <div className="grid gap-8 lg:grid-cols-2">
        <PaymentTimeline items={data.paymentItems} />
        <CreditCardsSection data={data.finance.creditCardsData} />
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
        month={sMonth.toString()} year={sYear.toString()} q={q || ""}
      />
    </div>
  );
}