import prisma from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpCircle, ArrowDownCircle, Wallet, CreditCard } from "lucide-react";
import CategoryPicker from "@/components/CategoryPicker";
import ImportForm from "@/components/ImportForm";
import MonthPicker from "@/components/MonthPicker";
import CategoryChart from "@/components/CategoryChart";
import EvolutionChart from "@/components/EvolutionChart";
import CreditCardSummary from "@/components/CreditCardSummary";
import { getBillingPeriod } from "@/lib/date-utils";
import SearchInput from "@/components/SearchInput";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ month?: string; year?: string; q?: string, limit?: string }>;
}) {
  const { month, year, q, limit } = await searchParams;

  const currentLimit = parseInt(limit || "10")

  const selectedMonth = parseInt(month || (new Date().getMonth() + 1).toString());
  const selectedYear = parseInt(year || new Date().getFullYear().toString());

  const accounts = await prisma.account.findMany();
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });

  const allTransactions = await prisma.transaction.findMany({
    include: { account: true, category: true },
  });

  const transactions = allTransactions.filter((t) => {
    let isInDateRange = false;
    
    if (t.account.type === "CREDIT" && t.account.closingDay) {
      const { startDate, endDate } = getBillingPeriod(selectedMonth, selectedYear, t.account.closingDay);
      isInDateRange = t.date >= startDate && t.date <= endDate;
    } else {
      isInDateRange = (
        t.date.getMonth() === selectedMonth - 1 &&
        t.date.getFullYear() === selectedYear
      );
    }

    const matchesSearch = q 
    ? t.description.toLowerCase().includes(q.toLowerCase()) 
    : true;

    return isInDateRange && matchesSearch;
    
  });

  const totalTransactions = transactions.length;
  const paginatedTransactions = transactions.slice(0, currentLimit);

  const totalBalance = transactions.reduce((acc, t) => acc + t.amount, 0);
  const totalIncomes = transactions.filter((t) => t.amount > 0).reduce((acc, t) => acc + t.amount, 0);
  const totalExpenses = transactions.filter((t) => t.amount < 0).reduce((acc, t) => acc + t.amount, 0);

  const expensesByCategory = transactions
    .filter((t) => t.amount < 0)
    .reduce((acc: any, t) => {
      const categoryName = t.category?.name || "Sem categoria";
      acc[categoryName] = (acc[categoryName] || 0) + Math.abs(t.amount);
      return acc;
    }, {});

  const chartData = Object.keys(expensesByCategory).map((name) => ({
    name,
    value: expensesByCategory[name],
  }));

  const sixMonthsAgo = new Date(selectedYear, selectedMonth - 6, 1);
  const endOfPeriod = new Date(selectedYear, selectedMonth, 1);

  const periodTransactions = await prisma.transaction.findMany({
    where: { date: { gte: sixMonthsAgo, lt: endOfPeriod } },
  });

  const evolutionData = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(selectedYear, selectedMonth - 1 - i, 1);
    const monthName = d.toLocaleString("pt-BR", { month: "short" }).toUpperCase();
    const mTransactions = periodTransactions.filter(
      (t) => t.date.getMonth() === d.getMonth() && t.date.getFullYear() === d.getFullYear()
    );
    evolutionData.push({
      month: monthName,
      receitas: mTransactions.filter((t) => t.amount > 0).reduce((acc, t) => acc + t.amount, 0),
      despesas: Math.abs(mTransactions.filter((t) => t.amount < 0).reduce((acc, t) => acc + t.amount, 0)),
    });
  }

  const creditCardsData = accounts
    .filter((acc) => acc.type === "CREDIT")
    .map((acc) => {
      const invoiceAmount = transactions
        .filter((t) => t.accountId === acc.id)
        .reduce((sum, t) => sum + t.amount, 0);
      return { ...acc, invoiceAmount };
    });

  return (
    <div className="min-h-screen bg-[#09090b] text-white p-4 md:p-10 space-y-8 font-sans">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-white/10 pb-8">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-white">FINANCE.<span className="text-4xl font-black tracking-tighter text-primary">RDEV</span></h1>
          <p className="text-zinc-400 font-medium">Sua inteligência financeira pessoal.</p>
        </div>
        <div className="flex flex-col md:flex-row items-center gap-4">
          <MonthPicker />
          <div className="bg-zinc-900/50 border border-white/10 p-2 rounded-2xl">
            <ImportForm />
          </div>
        </div>
      </header>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="bg-[#18181b] border-white/10 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 blur-3xl rounded-full -mr-10 -mt-10" />
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-widest text-zinc-500">Saldo Geral</CardTitle>
            <Wallet className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black">
              {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(totalBalance)}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#18181b] border-white/10 shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-widest text-zinc-500">Receitas</CardTitle>
            <ArrowUpCircle className="w-4 h-4 text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-emerald-400">
              {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(totalIncomes)}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#18181b] border-white/10 shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-widest text-zinc-500">Despesas</CardTitle>
            <ArrowDownCircle className="w-4 h-4 text-rose-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-rose-400">
              {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(totalExpenses)}
            </div>
          </CardContent>
        </Card>
      </div>

      {creditCardsData.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2 text-zinc-300">
            <CreditCard className="w-5 h-5 text-primary" />
            Meus Cartões
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {creditCardsData.map((card) => (
              <CreditCardSummary
                key={card.id}
                name={card.name}
                invoiceAmount={card.invoiceAmount}
                limit={card.limit || 0}
                dueDay={card.dueDay || 0}
              />
            ))}
          </div>
        </section>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 bg-[#18181b] border-white/10 p-6">
          <CardHeader className="px-0 pt-0">
            <CardTitle className="text-lg font-bold">Evolução de Fluxo</CardTitle>
          </CardHeader>
          <CardContent className="px-0">
            <EvolutionChart data={evolutionData} />
          </CardContent>
        </Card>

        <Card className="bg-[#18181b] border-white/10 p-6">
          <CardHeader className="px-0 pt-0">
            <CardTitle className="text-lg font-bold">Gastos por Categoria</CardTitle>
          </CardHeader>
          <CardContent className="px-0">
            {chartData.length > 0 ? (
              <CategoryChart data={chartData} />
            ) : (
              <div className="h-75 flex items-center justify-center text-zinc-500 text-sm italic text-center">
                Nenhum dado categorizado<br />neste período.
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold text-zinc-300">Detalhamento das Transações</h2>
        <SearchInput /> 
        <div className="rounded-2xl border border-white/10 bg-[#18181b] overflow-hidden shadow-2xl">
          <table className="w-full text-sm">
            <thead className="bg-white/5 border-b border-white/10">
              <tr>
                <th className="px-6 py-5 text-left font-bold text-zinc-400 uppercase tracking-tighter">Descrição</th>
                <th className="px-6 py-5 text-left font-bold text-zinc-400 uppercase tracking-tighter">Categoria</th>
                <th className="px-6 py-5 text-right font-bold text-zinc-400 uppercase tracking-tighter">Valor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {paginatedTransactions.map((t) => (
                <tr key={t.id} className="hover:bg-white/2 transition-colors">
                  <td className="px-6 py-5 font-bold text-zinc-200">{t.description}</td>
                  <td className="px-6 py-5 text-zinc-400">
                    <CategoryPicker 
                      transactionId={t.id} 
                      currentCategoryId={t.categoryId} 
                      categories={categories} 
                    />
                  </td>
                  <td
                    className={`px-6 py-5 text-right font-black ${
                      t.amount < 0 ? "text-rose-400" : "text-emerald-400"
                    }`}
                  >
                    {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(t.amount)}
                  </td>
                </tr>
              ))}
              {paginatedTransactions.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-6 py-20 text-center text-zinc-500 italic">
                    Nenhuma transação encontrada para este filtro.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          {totalTransactions > currentLimit && (
            <div className="p-4 border-t border-white/10 flex justify-center">
              <a
                href={`/?month=${month || ''}&year=${year || ''}&q=${q || ''}&limit=${currentLimit + 10}`}
                className="text-xs font-bold text-primary hover:underline uppercase tracking-widest"
              >
                Ver mais transações (+10)
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}