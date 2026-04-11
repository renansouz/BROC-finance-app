import prisma from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpCircle, ArrowDownCircle, Wallet, CreditCard } from "lucide-react";
import CategoryPicker from "@/components/CategoryPicker";
import ImportForm from "@/components/ImportForm";
import MonthPicker from "@/components/MonthPicker";
import CategoryChart from "@/components/CategoryChart";
import EvolutionChart from "@/components/EvolutionChart";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ month?: string; year?: string }>;
}) {
  const { month, year } = await searchParams;

  const selectedMonth = parseInt(month || (new Date().getMonth() + 1).toString());
  const selectedYear = parseInt(year || new Date().getFullYear().toString());

  const startDate = new Date(selectedYear, selectedMonth - 1, 1);
  const endDate = new Date(selectedYear, selectedMonth, 1);

  const transactions = await prisma.transaction.findMany({
    where: { date: { gte: startDate, lt: endDate } },
    include: { category: true },
    orderBy: { date: 'desc' },
  });

  const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } });

  const totalBalance = transactions.reduce((acc, t) => acc + t.amount, 0);
  const totalIncomes = transactions.filter(t => t.amount > 0).reduce((acc, t) => acc + t.amount, 0);
  const totalExpenses = transactions.filter(t => t.amount < 0).reduce((acc, t) => acc + t.amount, 0);

  const expensesByCategory = transactions
    .filter(t => t.amount < 0)
    .reduce((acc: any, t) => {
      const categoryName = t.category?.name || "Sem categoria";
      acc[categoryName] = (acc[categoryName] || 0) + Math.abs(t.amount);
      return acc;
    }, {});

  const categoryChartData = Object.keys(expensesByCategory).map(name => ({
    name,
    value: expensesByCategory[name]
  }));

  const sixMonthsAgo = new Date(selectedYear, selectedMonth - 6, 1);
  const allPeriodTransactions = await prisma.transaction.findMany({
    where: { date: { gte: sixMonthsAgo, lt: endDate } }
  });

  const evolutionData = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(selectedYear, selectedMonth - 1 - i, 1);
    const mTransactions = allPeriodTransactions.filter(t => 
      t.date.getMonth() === d.getMonth() && t.date.getFullYear() === d.getFullYear()
    );

    evolutionData.push({
      month: d.toLocaleString('pt-BR', { month: 'short' }).toUpperCase(),
      receitas: mTransactions.filter(t => t.amount > 0).reduce((acc, t) => acc + t.amount, 0),
      despesas: Math.abs(mTransactions.filter(t => t.amount < 0).reduce((acc, t) => acc + t.amount, 0)),
    });
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-white p-4 md:p-10 space-y-8 font-sans">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-white/10 pb-8">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-white">FINANCE.RDEV</h1>
          <p className="text-zinc-400 font-medium italic">Visão estratégica das suas finanças.</p>
        </div>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <MonthPicker />
          <div className="bg-zinc-900/50 border border-white/10 p-2 rounded-xl">
            <ImportForm />
          </div>
        </div>
      </header>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="bg-[#18181b] border-white/10 shadow-2xl overflow-hidden group">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-widest text-zinc-500">Saldo no Período</CardTitle>
            <Wallet className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalBalance)}</div>
          </CardContent>
        </Card>

        <Card className="bg-[#18181b] border-white/10 shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-widest text-zinc-500">Entradas</CardTitle>
            <ArrowUpCircle className="w-4 h-4 text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-emerald-400">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalIncomes)}</div>
          </CardContent>
        </Card>

        <Card className="bg-[#18181b] border-white/10 shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-widest text-zinc-500">Saídas</CardTitle>
            <ArrowDownCircle className="w-4 h-4 text-rose-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-rose-400">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalExpenses)}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 bg-[#18181b] border-white/10 p-6">
          <CardHeader className="px-0 pt-0">
            <CardTitle className="text-lg font-bold">Evolução Mensal</CardTitle>
          </CardHeader>
          <CardContent className="px-0">
            <EvolutionChart data={evolutionData} />
          </CardContent>
        </Card>

        <Card className="bg-[#18181b] border-white/10 p-6">
          <CardHeader className="px-0 pt-0">
            <CardTitle className="text-lg font-bold">Distribuição</CardTitle>
          </CardHeader>
          <CardContent className="px-0">
            {categoryChartData.length > 0 ? (
              <CategoryChart data={categoryChartData} />
            ) : (
              <div className="h-[300px] flex items-center justify-center text-zinc-500 text-sm italic">Sem dados</div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-primary" />
          Movimentações
        </h2>
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
              {transactions.map((t) => (
                <tr key={t.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-5 font-bold text-zinc-200">{t.description}</td>
                  <td className="px-6 py-5">
                    <CategoryPicker 
                      transactionId={t.id} 
                      currentCategoryId={t.categoryId} 
                      categories={categories} 
                    />
                  </td>
                  <td className={`px-6 py-5 text-right font-black ${t.amount < 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(t.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}