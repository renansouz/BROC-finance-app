import prisma from "@/lib/prisma";
import { getEconomicIndicators } from "./economic-service";
import { getEvolutionData } from "./evolution-service";
import { getDashboardData } from "./finance-service";
import { calculateWealth } from "./investment-service";

export async function getFullDashboard(userId: string, selectedMonth: number, selectedYear: number, q: string | undefined) {
  const [
    accounts, 
    categories, 
    allTransactions, 
    evolutionData, 
    budgets, 
    investments, 
    indicators, 
    assets, 
    liabilities, 
    bills, 
    snapshots
  ] = await Promise.all([
    prisma.financialAccount.findMany({ where: { userId } }),
    prisma.category.findMany({ where: { userId }, orderBy: { name: "asc" } }),
    prisma.transaction.findMany({ where: { userId }, include: { financialAccount: true, category: true } }),
    getEvolutionData(userId, selectedMonth, selectedYear),
    prisma.budget.findMany({ where: { userId, month: selectedMonth, year: selectedYear }, include: { category: true } }),
    prisma.investment.findMany({ where: { userId } }),
    getEconomicIndicators(),
    prisma.asset.findMany({ where: { userId } }),
    prisma.liability.findMany({ where: { userId } }),
    prisma.bill.findMany({ where: { userId, paid: false } }),
    prisma.wealthSnapshot.findMany({ where: { userId }, orderBy: [{ year: 'asc' }, { month: 'asc' }] })
  ]);

  const finance = getDashboardData(allTransactions, accounts, categories, budgets, selectedMonth, selectedYear, q);

  const accountsWithBalance = accounts.map(acc => ({
    ...acc,
    balance: allTransactions.filter(t => t.financialAccountId === acc.id).reduce((sum, t) => sum + t.amount, 0)
  }));
  
  const wealth = calculateWealth(accountsWithBalance, investments, assets, liabilities);

  const paymentItems = [
    ...bills.map(b => ({ id: b.id, name: b.name, amount: b.amount, dueDay: b.dueDay, type: 'BILL' as const })),
    ...accountsWithBalance.filter(acc => acc.type === 'CREDIT' && acc.dueDay).map(acc => ({
      id: acc.id, name: acc.name, amount: acc.balance, dueDay: acc.dueDay!, type: 'CREDIT_CARD' as const
    }))
  ];

  const wealthEvolution = snapshots.map(s => ({ month: `${s.month}/${s.year}`, amount: s.amount }));

  return {
    finance,
    wealth,
    paymentItems,
    wealthEvolution,
    evolutionData, 
    indicators,
    categories,
    accounts
  };
}