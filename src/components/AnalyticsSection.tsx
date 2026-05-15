import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import EvolutionChart from "./EvolutionChart";
import CategoryChart from "./CategoryChart";

interface Props {
  evolutionData: any[];
  chartData: any[];
  topExpenses: any[];
}

export default function AnalyticsSection({ evolutionData, chartData, topExpenses }: Props) {
  const format = (val: number) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(val);

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <Card className="lg:col-span-1 bg-[#18181b] border-white/10 p-6">
        <CardHeader className="px-0 pt-0"><CardTitle className="text-lg font-bold uppercase tracking-tighter text-zinc-500">Evolução de Fluxo</CardTitle></CardHeader>
        <CardContent className="px-0"><EvolutionChart data={evolutionData} /></CardContent>
      </Card>

      <Card className="bg-[#18181b] border-white/10 p-6">
        <CardHeader className="px-0 pt-0"><CardTitle className="text-lg font-bold uppercase tracking-tighter text-zinc-500">Gastos por Categoria</CardTitle></CardHeader>
        <CardContent className="px-0">
          {chartData.length > 0 ? <CategoryChart data={chartData} /> : <div className="h-75 flex items-center justify-center text-zinc-500 italic">Sem dados.</div>}
        </CardContent>
      </Card>

      <Card className="bg-[#18181b] border-white/10 p-6">
        <CardHeader className="px-0 pt-0"><CardTitle className="text-lg font-bold uppercase tracking-tighter text-zinc-500">Maiores Gastos</CardTitle></CardHeader>
        <CardContent className="px-0 space-y-4">
          {topExpenses.map((expense) => (
            <div key={expense.id} className="flex justify-between items-center border-b border-white/5 pb-2 last:border-0">
              <div className="flex flex-col">
                <span className="text-sm font-bold text-zinc-200">{expense.description}</span>
                <span className="text-[10px] uppercase font-bold text-zinc-500">{expense.category?.name || 'Sem categoria'}</span>
              </div>
              <span className="text-sm font-black text-rose-500">{format(expense.amount)}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}