import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getFullDashboard } from "@/services/dashboard-service";
import TransactionsSection from "@/components/TransactionsSection";

export default async function TransactionsPage({ searchParams }: { searchParams: Promise<any> }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { month, year, q, limit } = await searchParams;
  const sMonth = parseInt(month || (new Date().getMonth() + 1).toString());
  const sYear = parseInt(year || new Date().getFullYear().toString());

  const data = await getFullDashboard(session.user.id, sMonth, sYear, q);

  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between pb-6 border-b border-border">
        <div>
          <h2 className="text-2xl font-bold text-zinc-100">Transações</h2>
          <p className="text-zinc-500 text-xs font-medium uppercase">Histórico detalhado de movimentações</p>
        </div>
      </header>

      <TransactionsSection 
        transactions={data.finance.transactions.slice(0, parseInt(limit || "20"))}
        totalTransactions={data.finance.transactions.length}
        currentLimit={parseInt(limit || "20")}
        categories={data.categories}
        month={sMonth.toString()}
        year={sYear.toString()}
        q={q || ""}
      />
    </div>
  );
}