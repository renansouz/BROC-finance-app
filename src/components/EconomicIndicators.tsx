import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, Percent } from "lucide-react";

interface Props {
  indicators: {
    selic: number;
    ipca: number;
  };
}

export default function EconomicIndicators({ indicators }: Props) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <Card className="bg-zinc-900/40 border-white/5 shadow-none overflow-hidden group hover:border-primary/30 transition-colors">
        <CardContent className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Selic (mês)</p>
              <p className="text-xl font-black text-white mt-1">{indicators.selic}%</p>
            </div>
            <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
              <TrendingUp className="w-3 h-3 text-primary" />
            </div>
          </div>
          <p className="text-[9px] text-zinc-600 mt-2 italic font-medium uppercase tracking-tighter">Taxa básica de juros</p>
        </CardContent>
      </Card>

      <Card className="bg-zinc-900/40 border-white/5 shadow-none overflow-hidden group hover:border-rose-500/30 transition-colors">
        <CardContent className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">IPCA (mês)</p>
              <p className="text-xl font-black text-rose-500 mt-1">{indicators.ipca}%</p>
            </div>
            <div className="p-2 bg-rose-500/10 rounded-lg group-hover:bg-rose-500/20 transition-colors">
              <Percent className="w-3 h-3 text-rose-500" />
            </div>
          </div>
          <p className="text-[9px] text-zinc-600 mt-2 italic font-medium uppercase tracking-tighter">Inflação oficial</p>
        </CardContent>
      </Card>
    </div>
  );
}