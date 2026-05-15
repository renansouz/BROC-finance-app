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

  const [accounts, categories, allTransactions, evolutionData] = await Promise.all([
    prisma.financialAccount.findMany({ where: { userId } }),
    prisma.category.findMany({ where: { userId }, orderBy: { name: "asc" } }),
    prisma.transaction.findMany({ where: { userId }, include: { financialAccount: true, category: true } }),
    getEvolutionData(userId, selectedMonth, selectedYear)
  ]);

  const { 
    transactions, 
    totalBalance, 
    totalIncomes, 
    totalExpenses, 
    chartData, 
    topExpenses, 
    creditCardsData 
  } = getDashboardData(allTransactions, accounts, categories, selectedMonth, selectedYear, q);

  const totalTransactions = transactions.length;
  const paginatedTransactions = transactions.slice(0, currentLimit);

  return (
    <div className="min-h-screen bg-[#09090b] text-white p-4 md:p-10 space-y-8 font-sans">
      <header className="flex items-center justify-between pb-6 border-b border-white/10">
        <div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tighter text-white">
            FINANCE.<span className="text-primary">RDEV</span>
          </h1>
          <p className="hidden md:block text-zinc-500 text-xs font-medium">Sua inteligência financeira pessoal.</p>
        </div>
        <UserButton user={session!.user} />
      </header>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/2 p-4 rounded-2xl border border-white/5">
        <div className="flex items-center gap-4">
          <MonthPicker />
          <div className="w-px h-6 bg-white/10 hidden md:block" />
          <p className="hidden lg:block text-xs text-zinc-500 font-bold uppercase tracking-widest">
            Mês de Competência
          </p>
        </div>
        <div>
        <ActionModal accounts={accounts} />
        </div>
      </div>

      <SummaryCards balance={totalBalance} incomes={totalIncomes} expenses={totalExpenses} />
      
      <CreditCardsSection data={creditCardsData} />

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