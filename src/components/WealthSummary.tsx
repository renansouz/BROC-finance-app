import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, ShieldCheck } from "lucide-react";

interface Props {
  totalWealth: number
  totalYield: number
}

export default function WealthSummary({ totalWealth, totalYield }: Props) {
  const format = (val: number) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(val);

  return (
    <Card className="bg-linear-to-br from-primary/20 to-zinc-900 border-primary/30 shadow-2xl overflow-hidden">
      <CardContent className="p-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary rounded-2xl">
            <ShieldCheck className="w-6 h-6 text-black" />
          </div>
          <div>
            <p className="text-xs font-bold text-primary uppercase tracking-widest">Patrimônio Total</p>
            <h2 className="text-4xl font-black text-white">{format(totalWealth)}</h2>
          </div>
        </div>

        <div className="flex flex-col items-end">
          <div className="flex items-center gap-2 text-emerald-400">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm font-bold">+{format(totalYield)} em rendimentos</span>
          </div>
          <p className="text-[10px] text-zinc-500 font-medium uppercase tracking-tighter">Crescimento total acumulado</p>
        </div>
      </CardContent>
    </Card>
  )
}