import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpCircle, ArrowDownCircle, Wallet } from "lucide-react";

interface Props {
  balance: number;
  incomes: number;
  expenses: number;
}

export default function SummaryCards({ balance, incomes, expenses }: Props) {
  const format = (val: number) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(val);

  return (
    <div className="grid gap-6 md:grid-cols-3">
      <Card className="bg-[#18181b] border-white/10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 blur-3xl rounded-full -mr-10 -mt-10" />
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xs font-bold uppercase tracking-widest text-zinc-500">Saldo Geral</CardTitle>
          <Wallet className="w-4 h-4 text-primary" />
        </CardHeader>
        <CardContent><div className="text-3xl font-black">{format(balance)}</div></CardContent>
      </Card>

      <Card className="bg-[#18181b] border-white/10 shadow-xl">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xs font-bold uppercase tracking-widest text-zinc-500">Receitas</CardTitle>
          <ArrowUpCircle className="w-4 h-4 text-emerald-400" />
        </CardHeader>
        <CardContent><div className="text-3xl font-black text-emerald-400">{format(incomes)}</div></CardContent>
      </Card>

      <Card className="bg-[#18181b] border-white/10 shadow-xl">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xs font-bold uppercase tracking-widest text-zinc-500">Despesas</CardTitle>
          <ArrowDownCircle className="w-4 h-4 text-rose-400" />
        </CardHeader>
        <CardContent><div className="text-3xl font-black text-rose-400">{format(expenses)}</div></CardContent>
      </Card>
    </div>
  );
}