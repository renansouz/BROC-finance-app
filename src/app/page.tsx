import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { performUserOnboarding } from "@/services/onboarding";
import { getDashboardData } from "@/services/finance-service";
import { getEvolutionData } from "@/services/evolution-service";

import UserButton from "@/components/UserButton";
import MonthPicker from "@/components/MonthPicker";
import ActionModal from "@/components/ActionModal";
import SummaryCards from "@/components/SummaryCards";
import CreditCardsSection from "@/components/CreditCardsSection";
import AnalyticsSection from "@/components/AnalyticsSection";
import TransactionsSection from "@/components/TransactionsSection";
import BudgetSection from "@/components/BudgetSection";
import ShareSummary from "@/components/ShareSummary";
import WealthSummary from "@/components/WealthSummary";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import WealthEvolutionChart from "@/components/WealthEvolutionChart";
import Header from "@/components/Header";
import { getEconomicIndicators } from "@/services/economic-service";
import { calculateWealth } from "@/services/investment-service";
import EconomicIndicators from "@/components/EconomicIndicators";
import WealthSection from "@/components/WealthSection";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ month?: string; year?: string; q?: string, limit?: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  const userId = session.user.id;

  await performUserOnboarding(userId);
  const { month, year, q, limit } = await searchParams;
  const currentLimit = parseInt(limit || "10");
  const selectedMonth = parseInt(month || (new Date().getMonth() + 1).toString());
  const selectedYear = parseInt(year || new Date().getFullYear().toString());

  const [accounts, categories, allTransactions, evolutionData, budgets, investments, indicators, assets] = await Promise.all([
  prisma.financialAccount.findMany({ where: { userId } }),
  prisma.category.findMany({ where: { userId }, orderBy: { name: "asc" } }),
  prisma.transaction.findMany({ where: { userId }, include: { financialAccount: true, category: true } }),
  getEvolutionData(userId, selectedMonth, selectedYear),
  prisma.budget.findMany({ 
    where: { userId, month: selectedMonth, year: selectedYear }, 
    include: { category: true } 
  }),
  prisma.investment.findMany({ where: { userId } }) ,
  getEconomicIndicators(),
  prisma.asset.findMany({ where: { userId } }) 
]);

  const { 
  transactions, 
  totalBalance, 
  totalIncomes, 
  totalExpenses, 
  chartData, 
  topExpenses, 
  creditCardsData,
  budgetSummary 
} = getDashboardData(allTransactions, accounts, categories, budgets, selectedMonth, selectedYear, q);

  const totalTransactions = transactions.length;
  const paginatedTransactions = transactions.slice(0, currentLimit);

  const snapshots = await prisma.wealthSnapshot.findMany({
    where: { userId },
    orderBy: [{ year: 'asc' }, { month: 'asc' }]
  });

  const wealthEvolutionData = snapshots.map(s => ({
    month: `${s.month}/${s.year}`,
    amount: s.amount
  }));

  const accountsWithBalance = accounts.map(acc => {
    const balance = allTransactions
      .filter(t => t.financialAccountId === acc.id)
      .reduce((sum, t) => sum + t.amount, 0);
    return { ...acc, balance };
  });

  const wealth = calculateWealth(accountsWithBalance, investments, assets);

  return (
    <div className="min-h-screen bg-[#09090b] text-white p-4 md:p-10 space-y-8 font-sans">
      <Header />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/2 p-4 rounded-2xl border border-white/5">
        <div className="flex items-center gap-4">
          <MonthPicker />
          <div className="w-px h-6 bg-white/10 hidden md:block" />
          <p className="hidden lg:block text-xs text-zinc-500 font-bold uppercase tracking-widest">
            Mês de Competência
          </p>
          <ShareSummary 
            month={selectedMonth.toString().padStart(2, '0')}
            year={selectedYear.toString()}
            balance={totalBalance}
            incomes={totalIncomes}
            expenses={totalExpenses}
            budgets={budgetSummary}
          />
        </div>
        <div>
        <ActionModal accounts={accounts} categories={categories} />
        </div>
      </div>

      <div className="lg:col-span-1">
        <WealthSummary totalWealth={wealth.totalWealth} totalYield={wealth.totalYield} />
        
        <div className="mt-6">
          <EconomicIndicators indicators={indicators} /> 
        </div>
      </div>
      <SummaryCards balance={totalBalance} incomes={totalIncomes} expenses={totalExpenses} />
      
      <CreditCardsSection data={creditCardsData} />

      <WealthSection data={wealthEvolutionData} />

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-zinc-900/50 p-4 rounded-xl border border-white/5">
          <p className="text-[10px] text-zinc-500 font-bold uppercase">Selic (Últ. Mês)</p>
          <p className="text-lg font-black text-white">{indicators.selic}%</p>
        </div>
        <div className="bg-zinc-900/50 p-4 rounded-xl border border-white/5">
          <p className="text-[10px] text-zinc-500 font-bold uppercase">IPCA (Inflação)</p>
          <p className="text-lg font-black text-rose-500">{indicators.ipca}%</p>
        </div>
      </div>

      <BudgetSection budgets={budgetSummary} />

      <AnalyticsSection 
        evolutionData={evolutionData} 
        chartData={chartData} 
        topExpenses={topExpenses} 
      />

      <TransactionsSection 
        transactions={paginatedTransactions}
        totalTransactions={totalTransactions}
        currentLimit={currentLimit}
        categories={categories}
        month={selectedMonth.toString().padStart(2, '0')}
        year={selectedYear.toString()}
        q={q || ""}
      />
    </div>
  );
}