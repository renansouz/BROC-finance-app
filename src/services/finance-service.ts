import { getBillingPeriod } from "@/lib/date-utils";

export function getDashboardData(
  allTransactions: any[],
  accounts: any[],
  categories: any[],
  budgets: any[],
  selectedMonth: number,
  selectedYear: number,
  q: string | undefined
) {
  // FILTRAGEM POR MÊS E BUSCA
  const transactions = allTransactions.filter((t) => {
    let isInDateRange = false;
    if (t.financialAccount.type === "CREDIT" && t.financialAccount.closingDay) {
      const { startDate, endDate } = getBillingPeriod(selectedMonth, selectedYear, t.financialAccount.closingDay);
      isInDateRange = t.date >= startDate && t.date <= endDate;
    } else {
      isInDateRange = t.date.getMonth() === selectedMonth - 1 && t.date.getFullYear() === selectedYear;
    }
    const matchesSearch = q ? t.description.toLowerCase().includes(q.toLowerCase()) : true;
    return isInDateRange && matchesSearch;
  });

  // TOTAIS 
  const totalBalance = transactions.reduce((acc, t) => acc + t.amount, 0);
  const totalIncomes = transactions.filter((t) => t.amount > 0).reduce((acc, t) => acc + t.amount, 0);
  const totalExpenses = transactions.filter((t) => t.amount < 0).reduce((acc, t) => acc + t.amount, 0);

  // GRÁFICO DE CATEGORIAS
  const expensesByCategory = transactions
    .filter((t) => t.amount < 0)
    .reduce((acc: any, t) => {
      const categoryName = t.category?.name || "Sem categoria";
      acc[categoryName] = (acc[categoryName] || 0) + Math.abs(t.amount);
      return acc;
    }, {});

  const chartData = Object.keys(expensesByCategory).map((name) => {
    const category = categories.find(c => c.name === name);
    return { name, value: expensesByCategory[name], color: category?.color || "#71717a" };
  });

  // MAIORES GASTOS
  const topExpenses = [...transactions]
    .filter(t => t.amount < 0)
    .sort((a, b) => a.amount - b.amount)
    .slice(0, 5);

  // DADOS DE CARTÃO
  const creditCardsData = accounts
    .filter((acc) => acc.type === "CREDIT")
    .map((acc) => {
      const invoiceAmount = transactions.filter((t) => t.financialAccountId === acc.id).reduce((sum, t) => sum + t.amount, 0);
      return { ...acc, invoiceAmount };
    });

  // LÓGICA DE BUDGETS
  const budgetSummary = budgets.map(b => {
    const spent = transactions
      .filter(t => t.categoryId === b.categoryId && t.amount < 0)
      .reduce((acc, t) => acc + Math.abs(t.amount), 0);

    return {
      categoryName: b.category.name,
      categoryColor: b.category.color || "#71717a",
      spent,
      limit: b.amount
    };
  });

  return {
    transactions,
    totalBalance,
    totalIncomes,
    totalExpenses,
    chartData,
    topExpenses,
    creditCardsData,
    budgetSummary
  };
}